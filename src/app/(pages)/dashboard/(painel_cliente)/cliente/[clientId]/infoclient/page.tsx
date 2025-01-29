'use client';


import { usePathname } from 'next/navigation';
import MultiStepForm from "@/app/components/infoclient/MultiStepForm";

const InfoClientPage = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[3];

    return (
            <MultiStepForm clientId={clientId} />
    );
};

export default InfoClientPage;
