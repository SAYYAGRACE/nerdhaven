import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { BackToHome } from "@/components/ui/back-to-home";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nerdhaven",
  description: "The unified learning ecosystem for primary scholars, secondary exam warriors, university researchers, and business founders.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Providers>
          <BackToHome />
          {children}
        </Providers>
      </body>
    </html>
  );
}
