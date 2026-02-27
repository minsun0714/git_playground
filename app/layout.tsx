import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, JetBrains_Mono, Jua } from "next/font/google";
import "./globals.css";

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  ),
  title: "Git 학습 퀴즈",
  description: "신입 온보딩 Git 학습 퀴즈와 실시간 랭킹",
  openGraph: {
    title: "Git 학습 퀴즈",
    description: "신입 온보딩 Git 학습 퀴즈와 실시간 랭킹",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Git 학습 퀴즈",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git 학습 퀴즈",
    description: "신입 온보딩 Git 학습 퀴즈와 실시간 랭킹",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="ko">
      <body
        className={`${ibmPlexSansKr.variable} ${jetBrainsMono.variable} ${jua.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-1 pb-16">{children}</main>
        <footer className="fixed bottom-0 left-0 w-full border-t bg-white/90 backdrop-blur">
          <div className="container mx-auto px-4 py-4 text-sm text-gray-600 text-center">
            © {currentYear} Lee Minsun. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
