import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mini-chat",
  description: "Tiny Next.js chat demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
