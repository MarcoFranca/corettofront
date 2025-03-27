'use client';

import { ReactNode, useEffect } from 'react';
import DashboardSidebar from '@/app/components/common/Header/DashboardSidebar';
import ClientDashboardSidebar from '../../../components/common/Header/ClientDashboardSidebar';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/app/components/ui/Button/ThemeToggle';
import { useAppDispatch, useAppSelector, useMediaQuery } from '@/services/hooks/hooks';
import { RootState } from '@/store';
import Spinner from '@/app/components/ui/loading/spinner/sppiner';

export default function DashboardTemplate({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.auth?.user);
    const token = useAppSelector((state: RootState) => state.auth?.token);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const isClientPage = pathname?.startsWith('/dashboard/cliente/');

    const SidebarComponent = isClientPage ? ClientDashboardSidebar : DashboardSidebar;

    useEffect(() => {
        if (!token?.access) {
            router.push('/');
        }
    }, [token, router]);

    if (!user || !token?.access) {
        return <Spinner text="Autenticando..." />;
    }

    return (
        <div className="dashboard-layout">
            {isDesktop && (
                <>
                    <SidebarComponent profileImage={user.profileImage} />
                    <ThemeToggle />
                </>
            )}
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}
