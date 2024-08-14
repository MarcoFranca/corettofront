'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";
import { fetchApolices } from '@/store/slices/apoliceSlice';
import { RootState } from '@/store';
import Link from 'next/link';
import styles from './styles.module.css';
import { usePathname } from "next/navigation";

const ApolicePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const apolices = useAppSelector((state: RootState) => state.apolices.apolices);
    const status = useAppSelector((state: RootState) => state.apolices.status);
    const error = useAppSelector((state: RootState) => state.apolices.error);
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[3];

    const [endpoint, setEndpoint] = useState('/apolices/planos-saude/'); // Defina o endpoint inicial

    useEffect(() => {
        if (clientId) {
            dispatch(fetchApolices({ clientId, endpoint }));
        }
    }, [clientId, endpoint, dispatch]);

    const handleProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const produto = e.target.value;
        switch (produto) {
            case 'plano_saude':
                setEndpoint('/apolices/planos-saude/');
                break;
            case 'seguro_vida':
                setEndpoint('/apolices/seguros-vida/');
                break;
            // Adicione os outros casos conforme necessário
            default:
                setEndpoint('/apolices/planos-saude/');
        }
    };

    return (
        <ClienteDashboardLayout clientId={clientId}>
            <h1>Apolices</h1>
            <div>
                <label>Filtrar por Produto:</label>
                <select onChange={handleProdutoChange}>
                    <option value="plano_saude">Plano de Saúde</option>
                    <option value="seguro_vida">Seguro de Vida</option>
                    {/* Adicione mais opções conforme necessário */}
                </select>
            </div>
            <Link href={`/dashboard/cliente/${clientId}/apolice/novo`}>
                <button>Adicionar Nova Apólice</button>
            </Link>
            {status === 'loading' && <p>Carregando apólices...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && (
                <ul className={styles.apoliceList}>
                    {apolices.map((apolice) => (
                        <li key={apolice.id} className={styles.apoliceItem}>
                            <Link href={`/dashboard/cliente/${clientId}/apolice/${apolice.id}`}>
                                {apolice.categoria || apolice.subcategoria} - {apolice.data_inicio}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </ClienteDashboardLayout>
    );
};

export default ApolicePage;
