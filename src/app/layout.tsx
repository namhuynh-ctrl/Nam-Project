import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wayground Quiz Maker",
  description: "AI-Powered & Frictionless Quiz Generation Module",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
