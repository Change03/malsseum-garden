import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/noto-serif-kr";
import "./globals.css";

const title = "말씀정원 · 두 주 동안 함께 자라는 말씀";
const description = "13명이 하나의 링크로 모여 2026년 7월 27일부터 두 주 동안 말씀을 읽고, 매주 새로운 공동 정원을 키우는 묵상 공간입니다.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  return {
    metadataBase,
    title,
    description,
    applicationName: "말씀정원",
    robots: { index: false, follow: false, nocache: true },
    icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
    openGraph: {
      title,
      description,
      siteName: "말씀정원",
      locale: "ko_KR",
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "말씀정원의 따뜻한 식물 정원" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF7EF",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
