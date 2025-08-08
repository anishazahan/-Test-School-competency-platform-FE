import Providers from "@/components/ui/providers";
import "./globals.css";
import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider";
// import Providers from "@/components/providers";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
