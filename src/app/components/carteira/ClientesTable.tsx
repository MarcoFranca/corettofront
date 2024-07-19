import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchClientes, deleteCliente } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import styles from './ClientesTable.module.css';
import Image from "next/image";
import Link from "next/link";
import { formatPhoneNumber } from '@/utils/utils'; // Importa a função de formatação

import DeleteIcon from '@/../public/assets/common/delete.svg';
import UpdateIcon from '@/../public/assets/common/editar_usuario_dark.svg';
import PhoneIcon from '@/../public/assets/common/whats2.svg';
import MailIcon from '@/../public/assets/common/mail.svg';

const ClientesTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientes = useAppSelector((state: RootState) => state.clientes.clientes);
    const status = useAppSelector((state: RootState) => state.clientes.status);
    const error = useAppSelector((state: RootState) => state.clientes.error);
    const [filter, setFilter] = useState<string | undefined>();
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        console.log('Fetching clientes with filter:', filter, 'and search:', search);  // Adiciona log para verificar os parâmetros
        dispatch(fetchClientes({ status: filter, search }));
    }, [dispatch, filter, search]);

    const handleDelete = (id: string) => {
        dispatch(deleteCliente(id));
    };

    const handleFilterChange = (newFilter: string | undefined) => {
        setFilter(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <div className={styles.container}>
            <h2>Carteira de Clientes</h2>
            <div className={styles.filters}>
                <button onClick={() => handleFilterChange(undefined)}>Todos</button>
                <button onClick={() => handleFilterChange('lead')}>Leads</button>
                <button onClick={() => handleFilterChange('ativo')}>Ativos</button>
                <button onClick={() => handleFilterChange('inativo')}>Inativos</button>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nome..."
                    className={styles.searchInput}
                />
            </div>
            {status === 'loading' && <p>Carregando...</p>}
            {error && <p className={styles.error}>{error}</p>}
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map(cliente => (
                    <tr key={cliente.id}>
                        <td>{cliente.nome}</td>
                        <td>
                            <div className={styles.phoneContainer}>
                                <Link href={`mailto:${cliente.email}`} passHref>
                                    <Image src={MailIcon} alt="Telefone" className={styles.actionIcons} />
                                </Link>
                                {cliente.email}
                            </div>
                        </td>
                        <td>
                            <div className={styles.phoneContainer}>
                                <Link href={`https://wa.me/+55${cliente.telefone}?text=${cliente.nome}`} passHref target={'_blank'}>
                                    <Image src={PhoneIcon} alt="Telefone" className={styles.actionIcons} />
                                </Link>
                                {formatPhoneNumber(cliente.telefone)}
                            </div>
                        </td>
                        <td>{cliente.status}</td>
                        <td>
                            <div className={styles.actions}>
                                <Image className={styles.actionIcons} src={UpdateIcon} alt="Editar" onClick={() => handleDelete(cliente.id)} priority />
                                <Image className={styles.actionIcons} src={DeleteIcon} alt="Deletar" onClick={() => handleDelete(cliente.id)} priority />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientesTable;
