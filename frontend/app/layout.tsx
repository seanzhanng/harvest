import type { Metadata } from "next";
import { Inter } from "next/font/google"; // or your preferred font
import "../styles/globals.css";
import NavBar from "@/components/NavBar"; // Adjust import path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Explorer",
  description: "Discover seasonal ingredients and recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* NavBar is now global */}
        <NavBar /> 
        {children}
      </body>
    </html>
  );
}