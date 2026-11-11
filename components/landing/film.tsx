"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { film } from "./content";
import { RevealText } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

const DIR = "/media/aftermovie";
const SMALL = "(max-width: 767px)";

// AV1 first (roughly half the size of H.264 at the same quality), H.264 as the fallback.
// Phones get 720p, everything else 1080p.
function Sources({ name, audio }: { name: "loop" | "film"; audio?: boolean }) {
  const a = audio ? ", mp4a.40.2" : "";
  return (
    <>
      <source media={SMALL} src={`${DIR}/${name}-720.av1.mp4`} type={`video/mp4; codecs="av01.0.05M.08${a}"`} />
      <source media={SMALL} src={`${DIR}/${name}-720.h264.mp4`} type={`video/mp4; codecs="avc1.64001F${a}"`} />
      <source src={`${DIR}/${name}-1080.av1.mp4`} type={`video/mp4; codecs="av01.0.08M.08${a}"`} />
      <source src={`${DIR}/${name}-1080.h264.mp4`} type={`video/mp4; codecs="avc1.640028${a}"`} />
    </>
  );
}

export function Film() {
  const frameRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [loopVisible, setLoopVisible] = useState(false);
  const near = useInView(frameRef, { margin: "25% 0px 25% 0px" });

  // The frame opens from the two middle grid columns to full-bleed as it scrolls into place.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "center center"] });
  const open = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.5 });
  const closed = useTransform(open, [0, 1], [1, 0]);
  const zoom = useTransform(open, [0, 1], [1.3, 1]);
  const captionOpacity = useTransform(open, [0.7, 1], [0, 1]);

  // A "Play" disc that trails the mouse across the frame; it rests in the centre otherwise.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const discX = useSpring(px, { stiffness: 260, damping: 26, mass: 0.6 });
  const discY = useSpring(py, { stiffness: 260, damping: 26, mass: 0.6 });

  // Only run the silent loop while it is near the viewport, and never for people who asked
  // for reduced motion or less data.
  useEffect(() => {
    const loop = loopRef.current;
    if (!loop) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (near && !playing && !reduce && !saveData) loop.play().catch(() => {});
    else loop.pause();
  }, [near, playing, reduce]);

  useEffect(() => {
    if (!near) filmRef.current?.pause();
  }, [near]);

  function play() {
    const video = filmRef.current;
    if (!video) return;
    // Called inside the click so mobile browsers treat it as a user-initiated play with sound.
    video.play().catch(() => {});
    setPlaying(true);
  }

  return (
    <section id="film" className="relative bg-paper pb-24 md:pb-36">
      <Guides />

      <Container className="relative">
        <div className="grid items-end gap-6 pb-10 md:grid-cols-4 md:pb-14">
          <Eyebrow index="02">Aftermovie</Eyebrow>
          <RevealText
            as="h2"
            text="Last year, in two minutes"
            className="text-5xl font-semibold tracking-[-0.05em] md:col-span-2 md:text-7xl"
          />
          <p className="text-xs text-ink/50 md:text-right">
            {film.title} · {film.duration}
          </p>
        </div>
      </Container>

      <motion.div
        ref={frameRef}
        className="lp-film relative h-[min(56.25vw,100svh)] w-full overflow-hidden bg-ink"
        style={reduce ? undefined : ({ "--c": closed } as React.CSSProperties)}
      >
        <motion.div className="absolute inset-0" style={reduce ? undefined : { scale: zoom }}>
          <picture>
            <source
              type="image/avif"
              srcSet={`${DIR}/poster-960.avif 960w, ${DIR}/poster-1920.avif 1920w`}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={`${DIR}/poster-960.webp 960w, ${DIR}/poster-1920.webp 1920w`}
              sizes="100vw"
            />
            <img
              src={`${DIR}/poster-1920.webp`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <video
            ref={loopRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            onPlaying={() => setLoopVisible(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              loopVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Sources name="loop" />
          </video>
        </motion.div>

        {/* The full film with sound. It sits on top, invisible, until someone presses play. */}
        <video
          ref={filmRef}
          preload="none"
          playsInline
          controls={playing}
          onEnded={() => setPlaying(false)}
          className={`absolute inset-0 h-full w-full bg-ink object-contain transition-opacity duration-500 ${
            playing ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Sources name="film" audio />
        </video>

        {!playing && (
          <button
            type="button"
            onClick={play}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse" || reduce) return;
              const r = e.currentTarget.getBoundingClientRect();
              px.set(e.clientX - r.left - r.width / 2);
              py.set(e.clientY - r.top - r.height / 2);
            }}
            onPointerLeave={() => {
              px.set(0);
              py.set(0);
            }}
            aria-label={`Play the ${film.title} aftermovie, ${film.durationLabel}, with sound`}
            className={`group absolute inset-0 text-white focus-visible:outline-none ${
              reduce ? "cursor-pointer" : "md:cursor-none"
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <motion.span
                style={{ x: discX, y: discY }}
                className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-primary-500 text-xs font-semibold text-ink transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink md:h-28 md:w-28 md:text-sm"
              >
                Play
              </motion.span>
            </span>

            <motion.span
              style={{ opacity: reduce ? 1 : captionOpacity }}
              className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 pb-4 text-left text-xs sm:px-6 sm:pb-6 lg:px-10 lg:pb-8"
            >
              <span>
                <span className="block text-white/60">Aftermovie</span>
                <span className="block text-sm font-semibold md:text-base">{film.title}</span>
              </span>
              <span className="text-white/60">Sound on · {film.duration}</span>
            </motion.span>
          </button>
        )}
      </motion.div>
    </section>
  );
}
