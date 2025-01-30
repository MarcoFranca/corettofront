import React from 'react';
import styles from './OpportunitiesTable.module.css';
import { Cliente } from '@/types/interfaces';
import {FaLightbulb} from "react-icons/fa";
import Image from "next/image";
import EditImage from "../../../../../../../../public/assets/common/edit.svg";

interface OpportunitiesTableProps {
    cliente: Cliente;
}

interface ApoliceDetalhes {
    total_apolices: number;
    total_valor: number;
}

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = ({ cliente }) => {
    const oportunidades = cliente.oportunidades || [];

    // Criar um array de apólices que o cliente ainda não possui
    const apolicesDetalhes = cliente.apolices_detalhes || {};

    const apolicesFaltantes = Object.entries(apolicesDetalhes)
        .filter(([_, detalhes]) => (detalhes as ApoliceDetalhes).total_apolices === 0) // Cast de tipo explícito
        .map(([tipo]) => ({
            tipo: tipo.replace('_', ' '), // Formata o nome da apólice para exibição
            descricao: `O cliente ainda não possui ${tipo.replace('_', ' ')}.`,
        }));

    return (
        <div className={styles.opportunitiesContainer}>
            <div className={styles.cardHeader}>
                <div className={styles.titleContainer}>
                    <FaLightbulb className={styles.StaticIcon}/>
                    <h3>Oportunidades Identificadas</h3>
                </div>
                <Image src={EditImage} alt={"Editar"} className={styles.editIcon} priority/>
            </div>
            {oportunidades.length > 0 ? (
                <table className={styles.opportunitiesTable}>
                    <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Descrição</th>
                        <th>Prioridade</th>
                        <th>Observações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {oportunidades.map((oportunidade) => (
                        <tr key={oportunidade.produto_interesse}>
                            <td>{oportunidade.produto_interesse}</td>
                            <td>{oportunidade.descricao}</td>
                            <td>{oportunidade.prioridade}</td>
                            <td>{oportunidade.observacoes || 'Nenhuma'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma oportunidade cadastrada pelo usuário.</p>
            )}
            {/* Separador visual */}
            <hr className={styles.separator} />

            {/* Oportunidades geradas automaticamente */}
            <h3>Oportunidades Automáticas</h3>
            {apolicesFaltantes.length > 0 ? (
                <table className={styles.opportunitiesTable}>
                    <thead>
                    <tr>
                        <th>Tipo de Apólice</th>
                        <th>Descrição</th>
                    </tr>
                    </thead>
                    <tbody>
                    {apolicesFaltantes.map((apolice, index) => (
                        <tr key={index}>
                            <td>{apolice.tipo.replace('_', ' ')}</td>
                            <td>{apolice.descricao}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>O cliente já possui todas as apólices.</p>
            )}
        </div>
    );
};

export default OpportunitiesTable;
