// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: 'Coretor Lab - Leads',
  description: "CRM inteligente feito para corretores",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <>
        {children}
      </>
  );
}

