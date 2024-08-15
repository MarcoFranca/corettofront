'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchApolices, selectAllApolices, getApolicesStatus, getApolicesError } from '@/store/slices/apoliceSlice';
import { RootState } from '@/store';
import { usePathname } from 'next/navigation';
import styles from './ApoliceDetalhe.module.css';

const ApolicePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[3]; // Assumindo que o ID do cliente está na posição 3 da URL

    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolices = useAppSelector(selectAllApolices);
    const status = useAppSelector(getApolicesStatus);
    const error = useAppSelector(getApolicesError);

    useEffect(() => {
        if (clientId && clienteDetalhe) {
            dispatch(fetchApolices({ clientId }));
        }
    }, [clientId, clienteDetalhe, dispatch]);

    if (status === 'loading') {
        return <p>Carregando apólices...</p>;
    }

    if (status === 'failed') {
        return <p>Erro: {error}</p>;
    }

    return (
        <div className={styles.container}>
            <h1>Apólices</h1>
            {apolices && apolices.plano_saude.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Número da Apólice</th>
                        <th>Produto</th>
                        <th>Seguradora</th>
                        <th>Data de Início</th>
                        <th>Data de Vencimento</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {apolices.plano_saude.map((apolice) => (
                        <tr key={apolice.id}>
                            <td>{apolice.numero_apolice}</td>
                            <td>{apolice.produto}</td>
                            <td>{apolice.seguradora}</td>
                            <td>{new Date(apolice.data_inicio).toLocaleDateString()}</td>
                            <td>{new Date(apolice.data_vencimento).toLocaleDateString()}</td>
                            <td>
                                {/* Aqui você pode adicionar links para detalhes da apólice ou ações */}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma apólice encontrada.</p>
            )}
        </div>
    );
};

export default ApolicePage;
