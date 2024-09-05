'use client';
import styles from './styles.module.css';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";
import LeadModal from "@/app/components/Modal/LeadModal";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/store";
import { fetchClienteDetalhe } from "@/store/slices/clientesSlice";
import Image from 'next/image';

// imagens
import LogoImage from '../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg';
import DashboardImage from '../../../../../../public/assets/asideButtons/dashboard.svg';
import DolarImage from '../../../../../../public/assets/asideButtons/Leads.svg';
import CarteiraImage from '../../../../../../public/assets/asideButtons/carteira.svg';
import TodoImage from '../../../../../../public/assets/asideButtons/todo.svg';

const ClientDashboard = ({ clientId }: { clientId: string }) => {
    const dispatch = useAppDispatch();
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolicesDetalhes = clienteDetalhe?.apolices_detalhes;

    // Fetch clienteDetalhe sempre que o clientId mudar
    useEffect(() => {
        if (!clienteDetalhe || clienteDetalhe.id !== clientId) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [clientId, clienteDetalhe, dispatch]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLeadSubmit = async (leadData: any) => {
        // Submit lead data
        closeModal();
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
                <Image src={LogoImage} alt={'logo'} className={styles.logo} priority />
            </div>
            <div className={styles.headerBar}>
                <div className={styles.userMenu}>
                    <div className={styles.ClientMenuAcecces}>
                        <p>{clienteDetalhe?.nome ?? 'Carregando...'}</p>
                        <small>Status: {clienteDetalhe?.status ?? 'Indefinido'}</small>
                        <small>Apólices Ativas: {apolicesDetalhes?.total_apolices ?? 0}</small>
                    </div>
                </div>
            </div>

            <LeadModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSubmit={handleLeadSubmit}
            />
            <nav>
                <ul>
                    <Cell url='/dashboard/carteira' image={DashboardImage} alt="Dashboard" text={'RETORNAR'} campo={'dashboard'} />
                    <Cell url={`/dashboard/cliente/${clientId}`} image={DolarImage} alt="Ficha do Cliente" campo={'fichaCliente'} text={'FICHA DO CLIENTE'} />
                    <Cell url={`/dashboard/cliente/${clientId}/infoclient`} image={DolarImage} alt="Infoclient" campo={'Infoclient'} text={'INFOCLIENT'} />
                    <Cell url={`/dashboard/cliente/${clientId}/apolice`} image={CarteiraImage} alt="apolice" campo={'apolice'} text={'APÓLICES'} />
                    <Cell url={`/dashboard/cliente/${clientId}/reuniao`} image={TodoImage} alt="reuniao" campo={'reuniao'} text={'REUNIÕES'} />
                </ul>
            </nav>
        </aside>
    );
};

export default ClientDashboard;
