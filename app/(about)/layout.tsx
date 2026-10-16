import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/about-page/data";
import { site } from "@/data/site";
import "./globals.css";

/*
 * The About page is its own root layout: no main-site header, footer or
 * stylesheet. It shares only the theme contract with the rest of the site —
 * the `theme` key in localStorage and the `dark` class on <html> — so a
 * visitor lands in the same palette they were browsing in.
 */
const inter = localFont({
  src: "./fonts/InterTight-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", style: "normal", weight: "400" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-serif-var",
  display: "swap",
});
const mono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-mono-var",
  weight: "100 800",
  display: "swap",
  preload: false,
});

const description = `${PROFILE.name} — ${PROFILE.role}. ${PROFILE.headline}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `About — ${PROFILE.name}`,
  description,
  alternates: { canonical: "/about/" },
  openGraph: {
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description,
    type: "profile",
    images: [{ url: "/og.png", alt: `${PROFILE.name}, ${PROFILE.role}` }],
  },
  twitter: { card: "summary_large_image", title: PROFILE.name, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080b12" },
  ],
  width: "device-width",
  initialScale: 1,
};

const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function AboutRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}.rv-mask>span{transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
