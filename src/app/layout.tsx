import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "JadeQuote",
  description: "solar financing pre-qualification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col items-center">
          <div className="w-full justify-items-center px-8 max-w-2xl">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
