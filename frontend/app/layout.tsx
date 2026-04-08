import type { Metadata } from "next";

import "@/app/globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
