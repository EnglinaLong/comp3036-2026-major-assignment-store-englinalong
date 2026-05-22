// import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import StorefrontProviders from "@/components/Store/StorefrontProviders";
import { getProducts } from "./posts";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Full-Stack Store",
  description: "Modern storefront for developer products and toolkits",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverCookies = await cookies();
  const theme = serverCookies.get("theme")?.value || "light";
  const initialProducts = await getProducts({
    active: true,
  });

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StorefrontProviders initialPosts={initialProducts}>
          {children}
        </StorefrontProviders>
      </body>
    </html>
  );
}
