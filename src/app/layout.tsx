import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEREMIAH MUTHAMA WAITA | Portfolio",
  description: "Portfolio of Jeremiah Muthama Waita — data analysis, software development, product thinking, and digital transformation work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}