// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";


export const metadata: Metadata = {
  title: 'CorretorLab-Dashboard',
  description: "CRM inteligente feito para corretores",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <ClienteDashboardLayout>
          {children}
      </ClienteDashboardLayout>
  );
}

