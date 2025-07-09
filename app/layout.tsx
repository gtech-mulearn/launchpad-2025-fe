import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/rQuery";

export const metadata: Metadata = {
  title: "Launchpad",
  description: "Mulearn Launchpad",
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
