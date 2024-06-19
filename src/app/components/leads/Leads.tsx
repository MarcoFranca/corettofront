'use client';

import React, { useState } from 'react';
import LeadBoard from '@/app/components/leadBoard/LeadBoard';
import LeadModal from '@/app/components/Modal/LeadModal';
import styles from './styles.module.css';
import DashboardSidebar from '@/app/components/common/Header/DashboardSidebar';
import DashboardHeader from '@/app/components/common/Header/NavBarDashboard';

const Leads = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitLead = async (leadData: any) => {
        // Adicione aqui a lógica para enviar os dados do lead para a API
        console.log('Dados do lead:', leadData);
        // Fechar o modal após o envio
        handleCloseModal();
    };

    return (
        <>
            <div className={styles.dashboardLayout}>
                <DashboardSidebar />
                <div className={styles.canvaLayout}>
                    <DashboardHeader />
                    <main className={styles.mainContent}>
                        <button onClick={handleOpenModal} className={styles.addButton}>
                            + Cadastrar Lead
                        </button>
                        <LeadBoard />
                    </main>
                </div>
            </div>
            <LeadModal isOpen={isModalOpen} onRequestClose={handleCloseModal} onSubmit={handleSubmitLead} />
        </>
    );
};

export default Leads;
