// ClientDashboard.tsx
"use client";
import styles from './styles.module.css';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/store";
import { fetchClienteDetalhe } from "@/store/slices/clientesSlice";
import Image from 'next/image';
import { useParams } from 'next/navigation';

// imagens
import LogoImage from '../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg';
import DashboardImage from '../../../../../../public/assets/asideButtons/dashboard.svg';
import DolarImage from '../../../../../../public/assets/asideButtons/Leads.svg';
import CarteiraImage from '../../../../../../public/assets/asideButtons/carteira.svg';
import TodoImage from '../../../../../../public/assets/asideButtons/todo.svg';

interface Params {
    clientId?: string;
}

const ClientDashboard = () => {
    const dispatch = useAppDispatch();
    const params = useParams() as Params;
    const clienteId = params.clientId ?? ''; // ✅ Obtém `clientId` corretamente
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolicesDetalhes = clienteDetalhe?.apolices_detalhes;

    // ✅ Fetch clienteDetalhe usando `clienteId`
    useEffect(() => {
        if (clienteId) {
            dispatch(fetchClienteDetalhe(clienteId));
        }
    }, [clienteId, dispatch]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLeadSubmit = async (leadData: any) => {
        closeModal();
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
                <Image src={LogoImage} alt={'logo'} className={styles.logo} height={50} width={50} priority />
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

            {/* Navegação com URL correta usando `clienteId` */}
            <nav>
                <ul>
                    <Cell url='/dashboard/carteira' image={DashboardImage} alt="Dashboard" text={'RETORNAR'} campo={'dashboard'} />
                    <Cell url={`/dashboard/cliente/${clienteId}`} image={DolarImage} alt="Ficha do Cliente" campo={'fichaCliente'} text={'FICHA DO CLIENTE'} />
                    <Cell url={`/dashboard/cliente/${clienteId}/infoclient`} image={DolarImage} alt="Infoclient" campo={'Infoclient'} text={'INFOCLIENT'} />
                    <Cell url={`/dashboard/cliente/${clienteId}/apolice`} image={CarteiraImage} alt="apolice" campo={'apolice'} text={'APÓLICES'} />
                    <Cell url={`/dashboard/cliente/${clienteId}/reuniao`} image={TodoImage} alt="reuniao" campo={'reuniao'} text={'REUNIÕES'} />
                </ul>
            </nav>
        </aside>
    );
};

export default ClientDashboard;
