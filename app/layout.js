import "./globals.css";
import {
  Instrument_Sans,
  Newsreader,
  Noto_Sans_Khmer,
  Noto_Serif_Khmer,
} from "next/font/google";
import collection from "../collection.config.js";
import SiteHeader from "../components/SiteHeader.js";

// Mockup fonts (docs/design-mockup.html). The Khmer faces load the khmer
// subset; the variable names feed the tokens in app/globals.css.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-newsreader",
});
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-instrument-sans",
});
const notoSerifKhmer = Noto_Serif_Khmer({
  subsets: ["khmer"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-khmer",
});
const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["400", "600"],
  variable: "--font-noto-sans-khmer",
});

const fontClasses = [
  newsreader.variable,
  instrumentSans.variable,
  notoSerifKhmer.variable,
  notoSansKhmer.variable,
].join(" ");

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontClasses}>
      <body
        style={{
          margin: 0,
          backgroundColor: "var(--bg)",
          color: "var(--ink)",
          fontFamily: "var(--font-sans)",
          minHeight: "100vh",
        }}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
