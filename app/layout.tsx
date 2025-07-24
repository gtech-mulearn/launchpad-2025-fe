import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/rQuery";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Launchpad Kerala 2025",
  description:
    "Launchpad Kerala 2025 is a premier job fair that brings together talented individuals and innovative companies in the technical and engineering fields.MuLearn Foundation aims to create meaningful connections that drive progress and innovation in Kerala's job market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster
          toastOptions={{
            classNames: {
              toast:
                "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton:
                "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton:
                "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
          }}
          position="top-right"
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
