import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchClienteDetalhe, updateClienteObservacao, updateClienteStatus } from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import styles from './ClientProfile.module.css';
import ContactInfoCard from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/ContactInfoCard';
import PersonalInfoCard from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(personalInfo)/PersonalInfoCard';
import DocumentInfoCard from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/DocumentInfoCard';
import HealthInfoCard from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/HealthInfoCard';
import AddressCard from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/AddressCard';
import ProfileImageMan from '../../../../../../../../public/assets/common/user.svg';
import ProfileImageWoman from '../../../../../../../../public/assets/common/PerfilMulher.svg';
import Image from "next/image";
import Card from '@/app/components/common/Card';
import Modal from 'react-modal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Importa o CSS padrão do Tippy.js
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaHeartbeat, FaBox, FaChartLine, FaLightbulb } from "react-icons/fa";
import { MdTouchApp } from "react-icons/md";

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
import ApolicesTable from "@/app/components/cliente/apoliceClient/ApolicesTable";
import Spinner from "@/app/components/common/spinner/sppiner";
import OpportunitiesTable from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/reuniao/OpportunitiesTable";

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
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const cliente = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const status = useAppSelector((state: RootState) => state.clientes.statusDetalhe);
    const error = useAppSelector((state: RootState) => state.clientes.errorDetalhe);
    const [selectedStatus, setSelectedStatus] = useState<string>(''); // Inicialize com string vazia


    const statusOptions = [
        { value: "lead", label: "Lead", color: "#FFA500", description: "Cliente potencial que ainda não fechou negócio." },
        { value: "negociacao", label: "Em Negociação", color: "#1E90FF", description: "Cliente em contato e negociação ativa." },
        { value: "ativo", label: "Cliente Ativo", color: "#32CD32", description: "Cliente que possui um serviço ativo." },
        { value: "nova_negociacao", label: "Nova Negociação", color: "#4682B4", description: "Cliente ativo, mas negociando novos produtos." },
        { value: "inativo", label: "Cliente Inativo", color: "#FF4500", description: "Cliente que já teve um serviço, mas não está mais ativo." },
        { value: "recusado", label: "Recusado", color: "#A52A2A", description: "Cliente recusou a oferta após a negociação." },
        { value: "reativacao_pendente", label: "Reativação Pendente", color: "#FFD700", description: "Cliente inativo com possibilidade de retorno." },
        { value: "cancelado", label: "Cancelado", color: "#8B0000", description: "Cliente que cancelou os serviços recentemente." },
    ];


    const openStatusModal = () => setIsStatusModalOpen(true);


    useEffect(() => {
        const pathSegments = pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];
        if (id) {
            setClientId(id);
        }
    }, [pathname]);

    useEffect(() => {
        if (clientId && (!cliente || cliente.id !== clientId)) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [clientId, cliente, dispatch]);

    useEffect(() => {
        if (cliente?.status) {
            setSelectedStatus(cliente.status); // Atualize o selectedStatus ao carregar cliente
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
        return <Spinner text={'Carregando...'} />;
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
                                {cliente.genero === 'M' ? (
                                    <Image src={ProfileImageMan} alt="Foto do Cliente" className={styles.profileImage}
                                           priority/>
                                ) : (
                                    <Image src={ProfileImageWoman} alt="Foto do Cliente" className={styles.profileImage}
                                           priority/>
                                )}
                                <div className={styles.headerText}>
                                    <h2>{`${cliente.nome} ${cliente.sobre_nome}`}</h2>
                                    <Tippy
                                        content={
                                            <div className={styles.tipyContante}>
                                                <div className={styles.tippyClick}>
                                                    <MdTouchApp size={18}/>
                                                    <p>Clique para alterar o Status</p>
                                                </div>
                                                <h3>
                                                {statusOptions.find(s =>
                                                    s.value === cliente.status)?.description}

                                                </h3>
                                            </div>
                                        }
                                        placement="bottom"
                                        theme="custom"
                                        animation="shift-away"
                                    >
                                        <p
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: statusOptions.find(s => s.value === cliente.status)?.color }}
                                            onClick={openStatusModal}
                                        >
                                            {statusOptions.find(s => s.value === cliente.status)?.label}
                                            <MdTouchApp size={16}/>
                                        </p>
                                    </Tippy>
                                </div>
                            </div>

                            <Modal isOpen={isStatusModalOpen} onRequestClose={() => setIsStatusModalOpen(false)} className={styles.statusModal}>
                                <h2 className={styles.modalTitle}>Alterar Status</h2>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className={styles.dropdown}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.modalActions}>
                                    <button
                                        onClick={() => {
                                            if (clientId && selectedStatus) {
                                                // Garantimos que clientId e selectedStatus não são nulos
                                                dispatch(updateClienteStatus({id: clientId, status: selectedStatus}));
                                                setIsStatusModalOpen(false);
                                            } else {
                                                console.error('clientId ou selectedStatus não está definido');
                                            }
                                        }}
                                        className={styles.confirmButton}
                                    >
                                        Confirmar
                                    </button>

                                    <button onClick={() => setIsStatusModalOpen(false)} className={styles.cancelButton}>
                                        Cancelar
                                    </button>
                                </div>
                            </Modal>


                            <p className={styles.creationDate}>
                                Criado
                                em: {cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : 'Data não disponível'}
                            </p>
                            <div className={styles.profileSectionContainer}>
                                <ContactInfoCard cliente={cliente}/>
                                <PersonalInfoCard cliente={cliente}/>
                                <DocumentInfoCard cliente={cliente}/>
                                <AddressCard cliente={cliente}/>
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

                            <TabList className={styles.tabList}>
                                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                                    <FaHeartbeat/> Saúde
                                </Tab>
                                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                                    <FaBox/> Produtos
                                </Tab>
                                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                                    <FaChartLine/> Informações Financeiras
                                </Tab>
                                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                                    <FaLightbulb/> Oportunidades
                                </Tab>
                            </TabList>

                            <TabPanel>
                                <HealthInfoCard cliente={cliente}/>
                            </TabPanel>
                            <TabPanel>
                                <ApolicesTable/>
                            </TabPanel>
                            <TabPanel>
                                <Card title="Informações Financeiras">
                                    <Bar data={financeData}/>
                                </Card>
                            </TabPanel>
                            <TabPanel>
                                <OpportunitiesTable cliente={cliente}/>
                            </TabPanel>
                            <TabPanel>
                                <HealthInfoCard cliente={cliente}/>
                            </TabPanel>
                            <TabPanel>
                                <ApolicesTable/>
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
