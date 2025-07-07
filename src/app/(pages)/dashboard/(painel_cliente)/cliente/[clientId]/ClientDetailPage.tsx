'use client';
import React, { useEffect, useState } from "react";
import {Spin, Alert, Drawer} from "antd";
import {

    FileTextOutlined,
    UsergroupAddOutlined,
    FileProtectOutlined,
    FileAddOutlined, HeartFilled,
} from "@ant-design/icons";
import { Cliente } from "@/types/interfaces";
import ClientHeader from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/ClientHeader";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import {
    CardGrid,
    CardTitle, CardValue,
    Container,
    InfoCard
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/ClientDetailPage.styles";
import EditClientDrawer
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/EditClientDrawer";
import NegotiationWizardModal
    from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/NegotiationWizardModal";
import ApoliceWizard from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/ApolicesWizard";
import {ApoliceDetalhada} from "@/types/ApolicesInterface";
import ScheduleMeetingDrawer from "@/app/components/Modal/meeting/ScheduleMeetingFormStyled";
import ClientContactDetailsDrawer
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/contato/ClientContactDrawer";
import ContactInfoCard from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/cards/ContactInfoCard";
import DocumentosInfoCard
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/cards/DocumentosInfoCard";
import ClientDocumentDetailsDrawer
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/documentos/ClientDocumentDetailsDrawer";
import AddressInfoCard
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/cards/AddressInfoCard";
import ClientAddressDetailsDrawer
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/address/ClientAddressDetailsDrawer";
import ClientSaudeDetailsDrawer
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/saude/ClientSaudeDetailsDrawer";
import SaudeInfoCard from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/cards/SaudeInfoCard";


// Componente principal
const ClientDetailPage: React.FC = () => {
    const [drawer, setDrawer] = useState<null | string>(null);
    const { clientId } = useParams();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editingApolice, setEditingApolice] = useState<ApoliceDetalhada | undefined>(undefined);
    const [showMeetingDrawer, setShowMeetingDrawer] = useState(false);
    const [editAba, setEditAba] = useState<string | undefined>(undefined);
    const [showSaudeDrawer, setShowSaudeDrawer] = useState(false);
    const [showEditSaudeDrawer, setShowEditSaudeDrawer] = useState(false);

    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        api.get(`/clientes/${clientId}/`)
            .then(res => {
                console.log(res.data);
                setCliente(res.data)
            })
            .catch(() => setError("Erro ao carregar cliente"))
            .finally(() => setLoading(false));
    }, [clientId]);

    const handleCloseEditDrawer = () => {
        setDrawer(null);
        setEditAba(undefined);
    };

    const handleNovaApolice = () => {
        setEditingApolice(undefined); // Novo cadastro
        setIsWizardOpen(true);
    };

    const handleEditarApolice = (apolice: ApoliceDetalhada) => {
        setEditingApolice(apolice);
        setIsWizardOpen(true);
    };

    const handleWizardClose = () => {
        setIsWizardOpen(false);
        setEditingApolice(undefined);
        // Aqui você pode recarregar as apólices do cliente se necessário!
    };

    if (loading) return <Spin style={{ margin: 60 }} />;
    if (error) return <Alert type="error" message={error} />;
    if (!cliente) return <Alert type="warning" message="Cliente não encontrado" />;

    const handleSaveCliente = (dadosAtualizados: Partial<Cliente>) => {
        setCliente((prev) => ({
            ...prev!,
            ...dadosAtualizados,
        }));
        setDrawer(null);
    };

    const handleNegociacao = () => setDrawer("negociacao");


    // Atalhos dos cards
    const handleEdit = () => {
        setEditAba("1"); // ou "1" se for sempre dados pessoais, "2" para contato
        setDrawer("editarContato");
    };
    const handleWhatsApp = () => {
        if (cliente.telefone) {
            window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`, "_blank");
        }
    };
    const handleNovaReuniao = () => setShowMeetingDrawer(true);

    return (
        <Container>
            {/* Header Premium */}
            <ClientHeader
                cliente={cliente}
                onEdit={handleEdit}
                onNovaApolice={handleNovaApolice}
                onWhatsApp={handleWhatsApp}
                onNovaReuniao={handleNovaReuniao}
                onNegociacao={handleNegociacao}
            />

            {/* InfoCards */}
            <CardGrid>
                <ContactInfoCard onClick={() => setDrawer("contato")} email={cliente.email} telefone={cliente.telefone}/>

                <DocumentosInfoCard
                    onClick={() => setDrawer("documentos")}
                    cpf={cliente.cpf}
                    identidade={cliente.identidade}
                    tipoIdentidade={cliente.tipo_identidade}
                />
                <SaudeInfoCard
                    saude={cliente.relacionamentos?.saude}
                    onClick={() => setDrawer("saude")}
                />
                <AddressInfoCard
                    endereco={cliente.relacionamentos?.endereco}
                    onClick={() => setDrawer("endereco")}
                />

                <InfoCard $clickable onClick={() => setDrawer("profissao")}>
                    <CardTitle>
                        <FileProtectOutlined /> Profissional
                    </CardTitle>
                    <CardValue>
                        {cliente.profissao?.nome || "Não informado"}
                    </CardValue>
                </InfoCard>
                <InfoCard $clickable onClick={() => setDrawer("familia")}>
                    <CardTitle>
                        <UsergroupAddOutlined /> Família
                    </CardTitle>
                    <CardValue>
                        {cliente.filhos?.length || 0} filho(s)
                    </CardValue>
                </InfoCard>
                <InfoCard $clickable onClick={() => setDrawer("indicacoes")}>
                    <CardTitle>
                        <FileAddOutlined /> Indicações
                    </CardTitle>
                    <CardValue>
                        {cliente.indicado_por_detalhes
                            ? `Indicado por: ${cliente.indicado_por_detalhes.nome}`
                            : "Nenhuma indicação"}
                    </CardValue>
                </InfoCard>
                <InfoCard $clickable onClick={() => setDrawer("observacoes")}>
                    <CardTitle>
                        <FileTextOutlined /> Observações
                    </CardTitle>
                    <CardValue>
                        {cliente.observacoes || <span style={{ color: "#b8beca" }}>Sem notas</span>}
                    </CardValue>
                </InfoCard>
            </CardGrid>

            {/* Drawers condicionais podem ser montados aqui */}

            <ClientSaudeDetailsDrawer
                open={drawer === "saude"}
                saude={cliente.relacionamentos?.saude}
                onClose={() => setShowSaudeDrawer(false)}
                onEditClick={() => {
                    setEditAba("5"); // Abre aba 5 (saude) para edição no EditClientDrawer
                    setDrawer("editarContato");
                }}
            />

            <ClientAddressDetailsDrawer
                open={drawer === "endereco"}
                endereco={cliente.relacionamentos?.endereco}
                onClose={() => setDrawer(null)}
                onEditClick={() => {
                    setEditAba("4"); // Abre aba 4 (Endereço) para edição no EditClientDrawer
                    setDrawer("editarContato");
                }}
            />

            <ClientDocumentDetailsDrawer
                open={drawer === "documentos"}
                cliente={cliente}
                onClose={() => setDrawer(null)}
                onEditClick={() => {
                    setEditAba("3"); // "3" = aba de documentos
                    setDrawer("editarContato");
                }}
            />

            <ClientContactDetailsDrawer
                open={drawer === "contato"}
                cliente={cliente}
                onClose={() => setDrawer(null)}
                onEditClick={() => {
                    setEditAba("2"); // "2" é a aba Contato
                    setDrawer("editarContato");
                }}
            />


            {showMeetingDrawer && cliente && (
                <ScheduleMeetingDrawer
                    open={showMeetingDrawer}
                    onClose={() => setShowMeetingDrawer(false)}
                    cliente={cliente}
                    negociacao={undefined}
                    onSaved={() => {
                        setShowMeetingDrawer(false);
                        // Aqui você pode chamar algum fetch para atualizar a lista, se precisar.
                    }}
                />
            )}

            <Drawer
                title={editingApolice ? "Editar Apólice" : "Cadastro de Apólice"}
                placement="right"
                width="80vw"
                open={isWizardOpen}
                onClose={handleWizardClose}
                styles={{ body: { padding: 0, background: "#f8fbff" } }}
                destroyOnClose
            >
                <ApoliceWizard
                    apolice={editingApolice}
                    onClose={handleWizardClose}
                    clienteSelecionado={!editingApolice && cliente ? cliente : undefined}
                />
            </Drawer>

            <Drawer
                title={`Negociação com ${cliente?.nome}`}
                placement="right"
                width={900}
                open={drawer === "negociacao"}
                onClose={() => setDrawer(null)}
                destroyOnClose
            >
                <NegotiationWizardModal
                    isOpen={drawer === "negociacao"}
                    onClose={() => setDrawer(null)}
                    cliente={cliente}
                />
            </Drawer>

            <EditClientDrawer
                open={drawer === "editarContato"}
                cliente={cliente}
                onClose={() => handleCloseEditDrawer()}
                onSave={handleSaveCliente}
                defaultActiveTab={editAba}
            />
        </Container>
    );
};

export default ClientDetailPage;
