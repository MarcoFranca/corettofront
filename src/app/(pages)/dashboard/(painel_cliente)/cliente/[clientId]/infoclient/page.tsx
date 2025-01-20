'use client';


import { usePathname } from 'next/navigation';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";
import MultiStepForm from "@/app/components/infoclient/MultiStepForm";

const InfoClientPage = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[3];

    return (
        <ClienteDashboardLayout clientId={clientId}>
            <MultiStepForm clientId={clientId} />
        </ClienteDashboardLayout>
    );
};

export default InfoClientPage;
