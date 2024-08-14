import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchClienteDetalhe, updateClienteObservacao, updateCliente } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import styles from './ClientProfile.module.css';
import ContactInfoCard from '@/app/components/cliente/conta/ContactInfoCard';
import PersonalInfoCard from '@/app/components/cliente/conta/PersonalInfoCard';
import DocumentInfoCard from '@/app/components/cliente/conta/DocumentInfoCard';
import HealthInfoCard from '@/app/components/cliente/conta/HealthInfoCard';
import AddressCard from '@/app/components/cliente/conta/AddressCard';
import ProfileImageMan from '@/../public/assets/common/user.svg';
import ProfileImageWoman from '@/../public/assets/common/PerfilMulher.svg';
import Image from "next/image";
import Card from '../../common/Card';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ClientProfile: React.FC = () => {
    const pathname = usePathname();
    const [clientId, setClientId] = useState<string | null>(null);
    const [showObservation, setShowObservation] = useState<boolean>(false);
    const [observation, setObservation] = useState<string>('');
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

    useEffect(() => {
        if (cliente) {
            setObservation(cliente.observacoes || '');
        }
    }, [cliente]);

    const handleAddObservation = () => {
        setShowObservation(true);
    };

    const handleSaveObservation = () => {
        if (clientId) {
            dispatch(updateClienteObservacao({ id: clientId, observacoes: observation }));
        }
        setShowObservation(false);
    };

    const formatObservation = (text: string) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    const financeData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Renda Mensal',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: [4000, 3000, 5000, 4000, 6000, 7000]
            }
        ]
    };

    return (
        <div className={styles.profileContainer}>
            {cliente && (
                <>
                    <div className={styles.leftCard}>
                        <Card title="">
                            <div className={styles.profileHeader}>
                                {cliente.sexo === 'M' ? (
                                    <Image src={ProfileImageMan} alt="Foto do Cliente" className={styles.profileImage} priority />
                                ) : (
                                    <Image src={ProfileImageWoman} alt="Foto do Cliente" className={styles.profileImage} priority />
                                )}
                                <div className={styles.headerText}>
                                    <h2>{cliente.nome}</h2>
                                    <p className={styles.status}>{cliente.status}</p>
                                </div>
                            </div>
                            <p className={styles.creationDate}>
                                Criado em: {cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : 'Data não disponível'}
                            </p>
                            <div className={styles.profileSectionContainer}>
                                <ContactInfoCard cliente={cliente} />
                                <PersonalInfoCard cliente={cliente} />
                                <DocumentInfoCard cliente={cliente} />
                                <AddressCard cliente={cliente} />
                            </div>
                            {showObservation ? (
                                <div className={styles.observationSection}>
                        <textarea
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            placeholder="Adicione uma observação..."
                        />
                                    <button onClick={handleSaveObservation}>Salvar Observação</button>
                                </div>
                            ) : (
                                <button onClick={handleAddObservation} className={styles.addObservationButton}>
                                    Adicionar Observação
                                </button>
                            )}
                            {observation && (
                                <div className={styles.observationDisplay}>
                                    <strong>Observação:</strong>
                                    <p>{formatObservation(observation)}</p>
                                </div>
                            )}
                        </Card>
                    </div>
                    <div className={styles.rightCard}>
                        <Tabs>
                            <TabList>
                                <Tab>Saúde</Tab>
                                <Tab>Produtos</Tab>
                                <Tab>Informações Financeiras</Tab>
                            </TabList>

                            <TabPanel>
                                <HealthInfoCard cliente={cliente} />
                            </TabPanel>
                            <TabPanel>
                                <Card title="Produtos">Conteúdo dos produtos</Card>
                            </TabPanel>
                            <TabPanel>
                                <Card title="Informações Financeiras">
                                    <Bar data={financeData} />
                                </Card>
                            </TabPanel>
                        </Tabs>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientProfile;
