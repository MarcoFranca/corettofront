'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import DashboardLayout from "@/app/components/layouts/DashboardLayout";

const DashboardPage = () => {



    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout >
                    <div>Conteúdo do Dashboard</div>
            </DashboardLayout>
        </main>
    );
};

export default DashboardPage;
