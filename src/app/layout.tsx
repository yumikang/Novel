import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovelMind",
  description: "AI Assistant for Fanfiction Writers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AppSidebar />
        <main className="pl-64 min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
