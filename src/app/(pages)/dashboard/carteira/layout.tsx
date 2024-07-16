// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: 'Coretto-carteira',
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

