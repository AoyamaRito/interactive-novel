import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI創作プラットフォーム",
  description: "AIを活用した画像・ストーリー生成プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-slate-900">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}