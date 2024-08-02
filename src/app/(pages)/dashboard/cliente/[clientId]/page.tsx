'use client';

import ClientProfile from '@/app/components/cliente/conta';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";

const ClientPage = ({ params }: { params: { clientId: string } }) => {
    const { clientId } = params;

    return (
        <ClienteDashboardLayout clientId={clientId}>
            <ClientProfile />
        </ClienteDashboardLayout>
    );
};

export default ClientPage;
