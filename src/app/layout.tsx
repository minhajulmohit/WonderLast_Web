import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav/navbar";
import Footer from "@/components/footer/footer";
import { Toaster } from "@/components/ui/toast";

const CormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Wanderlast",
    template: "%s | Wanderlast",
  },
  description:
    "Discover and book memorable travel packages, destinations, and experiences with Wanderlast.",
  applicationName: "Wanderlast",
  keywords: ["Wanderlast", "travel", "tour packages", "destinations", "travel booking"],
  authors: [{ name: "Wanderlast" }],
  creator: "Wanderlast",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` ${CormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster>
          <NavBar />

          {children}
          <Footer />
        </Toaster>
      </body>
    </html>
  );
}
