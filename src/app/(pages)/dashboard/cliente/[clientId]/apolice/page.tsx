'use client'
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";
import { fetchApolices } from '@/store/slices/apoliceSlice';
import { fetchClienteDetalhe } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import { usePathname } from "next/navigation";
import { Apolices } from "@/types/interfaces";
import { FaEye, FaDownload, FaPlusCircle, FaInfoCircle } from 'react-icons/fa';
import styles from './styles.module.css';
import Link from "next/link";

type ApoliceTipos = keyof Apolices;

const ApolicePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolices = (clienteDetalhe?.apolices || {}) as Apolices;

    // Use um fallback para 'status' e 'error'
    const status = useAppSelector((state: RootState) => state.apolices?.status || 'idle');
    const error = useAppSelector((state: RootState) => state.apolices?.error || null);

    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[3];

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const [endpoint, setEndpoint] = useState<ApoliceTipos | 'todos'>('todos');

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [clientId, dispatch]);

    useEffect(() => {
        if (clientId && clienteDetalhe) {
            dispatch(fetchApolices({ clientId }));
        }
    }, [clientId, clienteDetalhe, dispatch]);

    const handleProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndpoint(e.target.value as ApoliceTipos);
    };

    const apolicesSelecionadas =
        endpoint === 'todos'
            ? [
                ...(apolices.plano_saude || []),
                ...(apolices.seguro_vida || []),
                ...(apolices.previdencia || []),
                ...(apolices.consorcio || []),
                ...(apolices.investimento || []),
                ...(apolices.seguro_profissional || []),
                ...(apolices.seguro_residencial || []),
            ]
            : apolices[endpoint as ApoliceTipos] || [];

    return (
        <ClienteDashboardLayout clientId={clientId}>
            <h1>Apólices</h1>
            <div className={styles.filterContainer}>
                <label htmlFor="produtoSelect">Filtrar por Produto:</label>
                <select id="produtoSelect" onChange={handleProdutoChange} className={styles.select}>
                    <option value="todos">Todos</option>
                    <option value="plano_saude">Plano de Saúde</option>
                    <option value="seguro_vida">Seguro de Vida</option>
                    <option value="previdencia">Previdência</option>
                    <option value="consorcio">Consórcio</option>
                    <option value="investimento">Investimento</option>
                    <option value="seguro_profissional">Seguro Profissional</option>
                    <option value="seguro_residencial">Seguro Residencial</option>
                </select>
                <Link href={`/dashboard/cliente/${clientId}/apolice/novo`} className={styles.addButton}>
                    <FaPlusCircle className={styles.icon} /> Adicionar Nova Apólice
                </Link>
            </div>
            {status === 'loading' && <p>Carregando apólices...</p>}
            {status === 'failed' && <p>{error}</p>}
            {status === 'succeeded' && (
                <div className={styles.containerTable}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Número da Apólice</th>
                            <th>Produto</th>
                            <th>Seguradora</th>
                            <th>Data de Início</th>
                            <th>Data de Vencimento</th>
                            <th>Forma de Pagamento</th>
                            <th>Periodicidade</th>
                            <th>Status Proposta</th>
                            <th>Valor do Prêmio Pago</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {apolicesSelecionadas.map((apolice) => (
                            <tr key={apolice.id}>
                                <td>{apolice.numero_apolice}</td>
                                <td>{apolice.produto}</td>
                                <td>{apolice.seguradora}</td>
                                <td>{new Date(apolice.data_inicio).toLocaleDateString()}</td>
                                <td>{new Date(apolice.data_vencimento).toLocaleDateString()}</td>
                                <td>{apolice.forma_pagamento}</td>
                                <td>{apolice.periodicidade_pagamento}</td>
                                <td className={apolice.status_proposta ? styles.propostaAprovada : styles.propostaRejeitada}>
                                    {apolice.status_proposta ? "Aprovada" : "Rejeitada"}
                                </td>
                                <td>R$ {parseFloat(apolice.premio_pago).toFixed(2)}</td>
                                <td>
                                    <Link href={`/dashboard/cliente/${clientId}/apolice/${apolice.produto}/${apolice.id}`}>
                                        <FaInfoCircle className={styles.icon} title="Detalhes da Apólice"/>
                                    </Link>
                                    <a href={`${BASE_URL}${apolice.arquivo}`} target="_blank" rel="noopener noreferrer" title="Visualizar Apólice">
                                        <FaEye className={styles.icon}/>
                                    </a>
                                    {apolice.arquivo && (
                                        <a href={`${BASE_URL}${apolice.arquivo}`} download title="Baixar Apólice">
                                            <FaDownload className={styles.icon}/>
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </ClienteDashboardLayout>
    );
};

export default ApolicePage;
