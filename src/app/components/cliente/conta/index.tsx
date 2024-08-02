'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchClienteDetalhe } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import styles from './ClientProfile.module.css';
import ProfileImage from '@/../public/assets/common/user.svg';
import Image from "next/image";
import Card from '@/app/components/common/Card';

const ClientProfile: React.FC = () => {
    const pathname = usePathname();
    const [clientId, setClientId] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const cliente = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const status = useAppSelector((state: RootState) => state.clientes.statusDetalhe);
    const error = useAppSelector((state: RootState) => state.clientes.errorDetalhe);

    useEffect(() => {
        const pathSegments = pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        if (id) {
            setClientId(id);
        }
    }, [pathname]);

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [clientId, dispatch]);

    const getValueOrDefault = (value: any, defaultValue: string) => {
        return value ? value : defaultValue;
    };

    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.profileContainer}>
            {cliente && (
                <>
                    <Card title="">
                        <div className={styles.profileHeader}>
                            <Image src={ProfileImage} alt="Foto do Cliente" className={styles.profileImage} priority />
                            <div className={styles.headerText}>
                                <h2>{cliente.nome}</h2>
                                <p className={styles.status}>{cliente.status}</p>
                            </div>
                        </div>
                        <div className={styles.profileDetails}>
                            <p className={styles.creationDate}>Criado em: {new Date(cliente.created_at).toLocaleDateString()}</p>
                            <div className={styles.profileCell}>
                                <h3 className={styles.titleDetails}>CPF:</h3><p> {getValueOrDefault(cliente.cpf, 'xxx.xxx.xxx-xx')}</p>
                            </div>
                            <div className={styles.profileCell}>
                                <h3 className={styles.titleDetails}>Data de Nascimento:</h3><p> {getValueOrDefault(cliente.data_nascimento, 'Não informado')}</p>
                            </div>
                            <div className={styles.profileCell}>
                                <h3 className={styles.titleDetails}>Sexo:</h3><p> {getValueOrDefault(cliente.sexo === 'M' ? 'Masculino' : cliente.sexo === 'F' ? 'Feminino' : 'Não informado', 'Não informado')}</p>
                            </div>
                            <div className={styles.profileCell}>
                                <h3 className={styles.titleDetails}>Profissão:</h3><p> {getValueOrDefault(cliente.profissao, 'Não informado')}</p>
                            </div>
                        </div>
                    </Card>
                    <Card title="">
                        <div className={styles.contactDetails}>
                            <h3>Contato</h3>
                            <p><strong>Telefone:</strong> {getValueOrDefault(cliente.telefone, 'Não informado')}</p>
                            <p><strong>Email:</strong> {getValueOrDefault(cliente.email, 'Não informado')}</p>
                        </div>
                        <div className={styles.addressDetails}>
                            <h3>Endereço</h3>
                            <p><strong>Endereço:</strong> {getValueOrDefault(cliente.endereco, 'Não informado')}</p>
                            <p><strong>Número:</strong> {getValueOrDefault(cliente.numero_endereco, 'Não informado')}</p>
                            <p><strong>Cidade:</strong> {getValueOrDefault(cliente.cidade, 'Não informado')}</p>
                            <p><strong>UF:</strong> {getValueOrDefault(cliente.uf, 'Não informado')}</p>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default ClientProfile;
