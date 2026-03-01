import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unified Digital Platform",
  description: "Enterprise-grade unified digital platform (portal shell).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
