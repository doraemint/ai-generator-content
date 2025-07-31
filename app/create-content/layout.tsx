// app/create-content/layout.tsx

import React, { ReactNode } from "react";
import { Metadata } from "next";
import "../globals.css"; // ถ้ามี global styles ให้ import ด้วย
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Create Content",
  description: "หน้าสร้างคอนเทนต์ของคุณ",
};

export default function CreateContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="">{children}</main>
    </div>
  );
}
