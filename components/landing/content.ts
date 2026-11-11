// All landing page copy lives here so sections stay purely presentational.

export const nav = [
  { href: "#about", label: "About" },
  { href: "#film", label: "Aftermovie" },
  { href: "#highlights", label: "Highlights" },
  { href: "#process", label: "Process" },
  { href: "#benefits", label: "Benefits" },
  { href: "#news", label: "News" },
  { href: "#recruiters", label: "Recruiters" },
];

export const cities = [
  { name: "Trivandrum", coords: "8.52°N 76.94°E" },
  { name: "Kochi", coords: "9.93°N 76.27°E" },
  { name: "Kozhikode", coords: "11.26°N 75.78°E" },
];

export const stats = [
  { value: "100+", label: "Companies" },
  { value: "1,000+", label: "Opportunities" },
  { value: "10,000+", label: "Candidates" },
];

export const highlights = [
  {
    title: "Skills-first assessment",
    body: "Candidates show what they can do through completed tasks, earned karma points and real project proofs. Whether through μLearn challenges or external portfolios, only proven, job-ready talent moves forward to interviews.",
  },
  {
    title: "Flexible interview locations",
    body: "Shortlisted candidates can opt for interviews in Trivandrum, Kochi or Kozhikode, streamlining the hiring process for companies and maximising participation from top talent.",
  },
  {
    title: "A state-wide talent pool",
    body: "A diverse pool sourced from across Kerala, covering a range of skill sets and experience levels, giving companies access to strong candidates for a multitude of roles.",
  },
];

export const process: {
  title: string;
  body: string;
  points?: { label: string; text: string }[];
}[] = [
  {
    title: "Register",
    body: "Companies sign up and onboard their recruiters to manage every hiring activity in one place.",
  },
  {
    title: "Post roles",
    body: "Openings are created in one of two formats.",
    points: [
      {
        label: "Challenge-based",
        text: "Tasks or real-world problem statements that assess skills directly.",
      },
      {
        label: "Criteria-based",
        text: "Filters across interest groups (Web Dev, AI/ML, UI/UX), karma points, academics, location and skills.",
      },
    ],
  },
  {
    title: "Discover talent",
    body: "Roles are matched with eligible μLearners, giving recruiters a refined shortlist of qualified candidates.",
  },
  {
    title: "Send invites",
    body: "Shortlisted candidates are invited directly. μLearners are notified instantly and can accept or decline.",
  },
  {
    title: "Schedule interviews",
    body: "Once a candidate accepts, interviews are coordinated at the company's convenience.",
  },
  {
    title: "Hire",
    body: "Selected candidates receive an official offer email with role details and next steps.",
  },
];

export const benefits = {
  recruiters: [
    {
      title: "Brand visibility",
      body: "Showcase your culture and career opportunities to top talent and position yourself as an employer of choice.",
    },
    {
      title: "Cost-efficient hiring",
      body: "Cut recruitment costs and streamline the hiring process while reaching the best talent Kerala has to offer.",
    },
    {
      title: "Access to proven talent",
      body: "Tap into a diverse pool of professionals, graduates and emerging talent with the skills needed for sustainable growth.",
    },
    {
      title: "A richer talent pipeline",
      body: "Build a future-ready workforce by nurturing relationships with promising candidates through internships and development programmes.",
    },
  ],
  students: [
    {
      title: "Networking",
      body: "Meet professionals and representatives from a wide range of companies, and build connections for internships and future roles.",
    },
    {
      title: "Industry insight",
      body: "Get close to the latest trends, technologies and challenges in your field, and learn which skills are in demand.",
    },
    {
      title: "Diverse career paths",
      body: "Companies across many sectors take part, exposing you to career paths you may not have considered before.",
    },
    {
      title: "Personal growth",
      body: "The assessment process pushes your limits and builds the resilience that carries into every interview after this one.",
    },
  ],
};

export const partners = [
  { role: "An initiative of", name: "IEEE Kerala Section", href: "https://ieeekerala.org" },
  { role: "Organised by", name: "μLearn Foundation", href: "https://mulearn.org" },
  { role: "In association with", name: "GTech", href: "https://gtechindia.org" },
  {
    role: "Supported by",
    name: "Kerala Development and Innovation Strategic Council",
    href: "https://kdisc.kerala.gov.in/en/",
  },
  {
    role: "Partner",
    name: "Kerala Knowledge Economy Mission",
    href: "https://knowledgemission.kerala.gov.in",
  },
];

/** The 2024 aftermovie. Files are produced by scripts/encode-media.mjs. */
export const film = {
  title: "Launchpad Kerala 2024",
  duration: "2:04",
  durationLabel: "2 minutes 4 seconds",
};

/** The two fairs of the 2024 edition. */
export const editions2024 = [
  {
    city: "Trivandrum",
    // The pasted brief said 15 June; the inauguration backdrop in the aftermovie reads 15th July 2024.
    date: "15 July 2024",
    dateTime: "2024-07-15",
    venue: "Clubhouse, Technopark, Kazhakuttam",
    summary:
      "Kerala Finance Minister K. N. Balagopal opened the first fair of the 2024 edition, organised by the IEEE Kerala Section and GTech μLearn. Fifteen companies met 212 candidates, with support from government and industry partners.",
    stats: [
      { value: "15", label: "Companies" },
      { value: "212", label: "Candidates" },
    ],
    companies: ["Tata Elxsi", "Genrobotics"],
  },
  {
    city: "Kochi",
    date: "19 July 2024",
    dateTime: "2024-07-19",
    venue: "JAIN (Deemed-to-be University), Infopark, Kakkanad",
    summary:
      "More than 4,000 people applied. Skills-first assessments narrowed that to 400, who were interviewed at Infopark by 12 companies. The Kerala Knowledge Economy Mission supported the fair.",
    stats: [
      { value: "4,000+", label: "Applications" },
      { value: "400", label: "Shortlisted" },
      { value: "12", label: "Companies" },
    ],
    companies: [
      "Abilytics",
      "Tata Elxsi",
      "Benlycos",
      "Bluecast",
      "CareStack",
      "Cubet",
      "Faith Infotech Academy",
      "Kott Software",
      "Pumex Infotech",
      "STPL",
      "Terveys",
    ],
  },
];

export type Clipping = {
  /** File name in /media/press, produced by scripts/encode-media.mjs from media-src/press. */
  slug: string;
  /** Pixel size of the original scan. */
  width: number;
  height: number;
  outlet: string;
  language: "English" | "Malayalam";
  /** English headline; translated for Malayalam clippings. */
  headline: string;
  date?: string;
};

/** Press coverage of the 2024 edition, in the order shown on the page. */
export const press: Clipping[] = [
  {
    slug: "img-20241118-wa0007",
    width: 1003,
    height: 994,
    outlet: "The Hindu",
    language: "English",
    headline: "IT firms usher in strategy to test capacity of candidates",
  },
  {
    slug: "whatsapp-image-2025-01-07-at-05-45-45-8a8a8658",
    width: 849,
    height: 645,
    outlet: "Mathrubhumi",
    language: "Malayalam",
    headline: "From campus placement to Launchpad: 83 placed so far",
    date: "30 Aug 2024",
  },
  {
    slug: "img-20250107-wa0007",
    width: 568,
    height: 1553,
    outlet: "Malayalam daily",
    language: "Malayalam",
    headline: "Launchpad Kerala scheme to get candidates ready for IT jobs",
  },
  {
    slug: "img-20241118-wa0009",
    width: 819,
    height: 842,
    outlet: "The New Indian Express",
    language: "English",
    headline: "State gears up for major shift in IT hiring process",
  },
  {
    slug: "img-20241118-wa0008",
    width: 1599,
    height: 509,
    outlet: "Malayala Manorama",
    language: "Malayalam",
    headline: "Not placements any more. Now it’s Launchpad",
  },
  {
    slug: "img-20250107-wa0005",
    width: 808,
    height: 613,
    outlet: "Malayalam daily",
    language: "Malayalam",
    headline: "Kerala overhauls IT recruitment, with skills first",
  },
  {
    slug: "img-20250107-wa0009",
    width: 1205,
    height: 1600,
    outlet: "The Times of India",
    language: "English",
    headline: "IT firms to follow skill-based hiring",
  },
  {
    slug: "img-20250107-wa0010",
    width: 1040,
    height: 1031,
    outlet: "Malayalam daily",
    language: "Malayalam",
    headline: "Kerala set for a complete change in IT recruitment",
  },
  {
    slug: "img-20250107-wa0008",
    width: 814,
    height: 1235,
    outlet: "Malayalam daily",
    language: "Malayalam",
    headline: "Launchpad Kerala begins: IT hiring is set to change",
  },
  {
    slug: "img-20250107-wa0011",
    width: 1575,
    height: 721,
    outlet: "Malayalam daily",
    language: "Malayalam",
    headline: "Kerala overhauls IT recruitment, with skills first",
  },
  {
    // Lowest-resolution scan (279 px wide), so it sits last.
    slug: "img-20250107-wa0006",
    width: 279,
    height: 1600,
    outlet: "Malayalam daily",
    language: "Malayalam",
    headline: "Skills take priority in IT recruitment",
  },
];

export const recruiters2024 = [
  "Abilytics",
  "Tata Elxsi",
  "Benlycos",
  "Bluecast",
  "CareStack",
  "Cubet",
  "Faith Infotech Academy",
  "Kott Software",
  "Pumex Infotech",
  "STPL",
  "Terveys",
  "Amdrodo",
  "Codelinks",
  "Expertzlab",
  "Faya",
  "Normality",
  "Pearlsoft",
  "Plusit",
  "Toobler",
  "Innoneur",
  "Open",
  "Software Incubator",
  "Cabot",
  "Curate",
  "Equip",
  "Fostering",
  "Ibil",
  "Kennedys",
  "QWY Soft",
];
