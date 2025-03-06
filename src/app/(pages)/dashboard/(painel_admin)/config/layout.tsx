// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: 'Corretor Lab - config',
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

