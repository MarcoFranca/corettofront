import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './ApolicesTable.module.css';
import { FaEye, FaDownload } from 'react-icons/fa';
import { Apolices } from "@/types/interfaces";

const ApolicesTable: React.FC = () => {
    const clienteDetalhe = useSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolices = (clienteDetalhe?.apolices || {}) as Apolices;
    const apolicesDetalhes = clienteDetalhe?.apolices_detalhes;

    // Juntando todas as apólices de diferentes tipos em um único array
    const todasApolices = [
        ...apolices.plano_saude,
        ...apolices.seguro_vida,
        ...apolices.previdencia,
        ...apolices.consorcio,
        ...apolices.investimento,
        ...apolices.seguro_profissional,
        ...apolices.seguro_residencial
    ];

    if (todasApolices.length === 0) {
        return <div>Nenhuma apólice encontrada.</div>;
    }

    return (
        <div className={styles.container}>
            <h3>Apólices</h3>

            {/* Exibindo Totais e Quantidades por Segmento */}
            {apolicesDetalhes && (
                <div className={styles.dashboard}>
                    <div className={styles.card}>
                        <h4>Total de Apólices</h4>
                        <p>{apolicesDetalhes.total_apolices}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Plano de Saúde</h4>
                        <p>Quantidade: {apolicesDetalhes.plano_saude.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.plano_saude.total_valor.toFixed(2)}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Seguro de Vida</h4>
                        <p>Quantidade: {apolicesDetalhes.seguro_vida.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.seguro_vida.total_valor.toFixed(2)}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Previdência</h4>
                        <p>Quantidade: {apolicesDetalhes.previdencia.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.previdencia.total_valor.toFixed(2)}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Consórcio</h4>
                        <p>Quantidade: {apolicesDetalhes.consorcio.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.consorcio.total_valor.toFixed(2)}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Investimento</h4>
                        <p>Quantidade: {apolicesDetalhes.investimento.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.investimento.total_valor.toFixed(2)}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Seguro Profissional</h4>
                        <p>Quantidade: {apolicesDetalhes.seguro_profissional.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.seguro_profissional.total_valor.toFixed(2)}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Seguro Residencial</h4>
                        <p>Quantidade: {apolicesDetalhes.seguro_residencial.total_apolices}</p>
                        <p>Valor Total: R$ {apolicesDetalhes.seguro_residencial.total_valor.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Tabela de Apólices */}
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
                {todasApolices.map((apolice) => (
                    <tr key={apolice.id}>
                        <td>{apolice.numero_apolice}</td>
                        <td>{apolice.produto}</td>
                        <td>{apolice.seguradora}</td>
                        <td>{new Date(apolice.data_inicio).toLocaleDateString()}</td>
                        <td>{new Date(apolice.data_vencimento).toLocaleDateString()}</td>
                        <td>
                            <a href={apolice.arquivo} target="_blank" rel="noopener noreferrer" title="Visualizar Apólice">
                                <FaEye style={{ marginRight: '10px' }} />
                            </a>
                            {apolice.arquivo && (
                                <a href={apolice.arquivo} download title="Baixar Apólice">
                                    <FaDownload />
                                </a>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApolicesTable;