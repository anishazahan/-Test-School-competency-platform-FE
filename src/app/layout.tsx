import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/ui/providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Test_School Competency Assessment",
  description:
    "Digital competency 3-step assessment and certification platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
