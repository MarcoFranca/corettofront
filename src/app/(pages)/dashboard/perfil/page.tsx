'use client';

import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import ProfilePage from "@/app/components/users/PERFIL/page";

const PerfilPage = () => {

    return (
        <>
            <DashboardLayout>
                <ProfilePage/>
            </DashboardLayout>
        </>
    );
};

export default PerfilPage;
