'use client';

import styles from './styles.module.css';
import ClientDetail from '@/app/components/cliente/conta';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
import { usePathname } from 'next/navigation';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";

const ClientPage = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[pathSegments.length - 1];

    return (
        <ClienteDashboardLayout clientId={clientId}>
            <ClientDetail />
        </ClienteDashboardLayout>
    );
};

export default ClientPage;
