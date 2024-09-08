'use client'
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";
import { fetchApolices, deleteApolice } from '@/store/slices/apoliceSlice';
import { fetchClienteDetalhe } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import { usePathname } from "next/navigation";
import { Apolices, Apolice } from "@/types/interfaces";
import { FaDownload, FaPlusCircle, FaInfoCircle, FaTrash } from 'react-icons/fa';
import styles from './styles.module.css';
import Link from "next/link";
import { formatMoney } from '@/utils/utils';
import ConfirmationModal from "@/app/components/Modal/confirm/ConfirmDeletModal";

const ApolicePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolices = (clienteDetalhe?.apolices || {}) as Apolices;

    const status = useAppSelector((state: RootState) => state.apolices?.status || 'idle');
    const error = useAppSelector((state: RootState) => state.apolices?.error || null);
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[3];

    const [endpoint, setEndpoint] = useState<keyof Apolices | 'todos'>('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apoliceToDelete, setApoliceToDelete] = useState<{ id: string, produto: string } | null>(null);
    const [apolicesSelecionadas, setApolicesSelecionadas] = useState<Apolice[]>([]);

    // Fetch cliente detalhe uma vez
    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [clientId, dispatch]);

    // Fetch apolices após clienteDetalhe estar carregado (sem depender de clienteDetalhe diretamente)
    useEffect(() => {
        if (clientId && clienteDetalhe?.id) {
            dispatch(fetchApolices({ clientId }));
        }
    }, [clientId, dispatch, clienteDetalhe?.id]); // Observe apenas o `clienteDetalhe?.id`

    // Atualizar as apólices selecionadas com base no endpoint
    useEffect(() => {
        const novasApolicesSelecionadas =
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
                : apolices[endpoint] || [];

        setApolicesSelecionadas(novasApolicesSelecionadas);
    }, [apolices, endpoint]);

    const handleProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndpoint(e.target.value as keyof Apolices);
    };

    const handleDeleteClick = (id: string, produto: string) => {
        setApoliceToDelete({ id, produto });
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (apoliceToDelete) {
            dispatch(deleteApolice({
                clientId,
                apoliceId: apoliceToDelete.id,
                produto: apoliceToDelete.produto
            })).then(() => {
                setApolicesSelecionadas((prevApolices) =>
                    prevApolices.filter(apolice => apolice.id !== apoliceToDelete.id)
                );
                setIsModalOpen(false);
                setApoliceToDelete(null);
            });
        }
    };

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
            {status === 'succeeded' && apolicesSelecionadas.length > 0 ? (
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
                                <td>{formatMoney(parseFloat(apolice.premio_pago))}</td>
                                <td>
                                    <Link href={`/dashboard/cliente/${clientId}/apolice/${apolice.produto}/${apolice.id}`}>
                                        <FaInfoCircle className={styles.actionIcon} title="Detalhes da Apólice"/>
                                    </Link>
                                    {apolice.arquivo && (
                                        <Link href={`${BASE_URL}${apolice.arquivo}`}  target='_blank' download title="Baixar Apólice">
                                            <FaDownload className={styles.actionIcon}/>
                                        </Link>
                                    )}
                                    <FaTrash
                                        className={styles.actionIcon}
                                        title="Excluir Apólice"
                                        onClick={() => handleDeleteClick(apolice.id, apolice.produto)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : status === 'succeeded' && apolicesSelecionadas.length === 0 ? (
                <p>Nenhuma apólice encontrada.</p>
            ) : null }

            <ConfirmationModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                message="Tem certeza de que deseja excluir esta apólice? Esta ação é permanente."
            />
        </ClienteDashboardLayout>
    );
};

export default ApolicePage;
