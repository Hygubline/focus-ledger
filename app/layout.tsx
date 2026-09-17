import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Focus Ledger", description: "Track Deep Work and Gaming with an honest weekly ledger.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
