import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import "@/app/globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CodeNovsu",
  description: "Платформа для обучения программированию с практикой, ИИ-подсказками и проектными треками.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${plexMono.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
