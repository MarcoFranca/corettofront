// ClientProfile.tsx
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchClienteDetalhe } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import styles from './ClientProfile.module.css';
import ContactInfoCard from '@/app/components/cliente/conta/ContactInfoCard';
import PersonalInfoCard from '@/app/components/cliente/conta/PersonalInfoCard';
import DocumentInfoCard from '@/app/components/cliente/conta/DocumentInfoCard';
import HealthInfoCard from '@/app/components/cliente/conta/HealthInfoCard';
import ProfileImage from '@/../public/assets/common/user.svg';
import Image from "next/image";
import Card from '../../common/Card';
import AddressCard from "@/app/components/cliente/conta/AddressCard";

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
                    <div className={styles.leftCard}>
                        <Card title="">
                            <div className={styles.profileHeader}>
                                <Image src={ProfileImage} alt="Foto do Cliente" className={styles.profileImage}
                                       priority/>
                                <div className={styles.headerText}>
                                    <h2>{cliente.nome}</h2>
                                    <p className={styles.status}>{cliente.status}</p>
                                </div>
                            </div>
                            <p className={styles.creationDate}>Criado
                                em: {new Date(cliente.created_at).toLocaleDateString()}</p>


                            <ContactInfoCard cliente={cliente}/>
                            <PersonalInfoCard cliente={cliente}/>
                            <DocumentInfoCard cliente={cliente}/>
                            <AddressCard cliente={cliente}/>
                        </Card>
                    </div>

                    <div className={styles.rightCard}>
                        <HealthInfoCard cliente={cliente}/>
                        <Card title="Produtos">
                            Conteúdo dos produtos
                        </Card>
                        <Card title="Informações Financeiras">
                            Conteúdo das informações financeiras
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientProfile;
