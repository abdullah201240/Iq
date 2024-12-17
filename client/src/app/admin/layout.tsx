"use client";

import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current route
  const isLoginPage = pathname === "/admin/login"; // Check if it's the login page

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      {/* Only wrap with DefaultLayout if it's not the login page */}
      {isLoginPage ? (
        <>
          <Toaster position="top-center" />
          {children}
        </>
      ) : (
        <DefaultLayout>
          <Toaster position="top-center" />
          {children}
        </DefaultLayout>
      )}
    </div>
  );
}
