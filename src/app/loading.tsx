// app/loading.tsx
'use client';

import dynamic from "next/dynamic";
const CustomLoading = dynamic(() => import("@/app/components/ui/loading/CustomLoadingClient"), { ssr: false });

export default function Loading() {
    return <CustomLoading />;
}
