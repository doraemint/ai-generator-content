// app/create-content/layout.tsx

import React, { ReactNode } from "react";
import { Metadata } from "next";
import "../globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "AI content helper",
  description: "AI content helper by นัก dev ฝึกหัด",
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
