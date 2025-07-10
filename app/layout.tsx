import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/rQuery";

export const metadata: Metadata = {
  title: "Launchpad Kerala 2025",
  description:
    "Launchpad Kerala 2025 is a premier job fair that brings together talented individuals and innovative companies in the technical and engineering fields. This collaboration between IEEE Kerala Section and GTech MuLearn aims to create meaningful connections that drive progress and innovation in Kerala's job market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
