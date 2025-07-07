import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import Spinner from "@/app/components/ui/loading/spinner/sppiner";
import {
    ProfileContainer,
    ProfileHeader,
    ProfileImage,
    HeaderText,
    StatusBadge,
    CreationDate,
    // ...outros styleds
} from "./ClientProfile.styles";
import { StatusType, STATUS_DETAILS } from "@/app/components/ui/Badge";
import ProfileImageMan from '../../../../../../../../public/assets/common/user.svg';
import ProfileImageWoman from '../../../../../../../../public/assets/common/PerfilMulher.svg';
import {TabPanel} from "react-tabs";
import ClientTabs from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/ClientTabs";
import { Cliente } from "@/types/interfaces";
import { EditOutlined } from "@ant-design/icons";
// ou
import { FaEdit } from "react-icons/fa";
import EditClientDrawer from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/EditClientDrawer"; // React Icons

export default function ClientProfile() {
    const { clientId } = useParams();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Busca cliente pelo ID
    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        api.get(`/clientes/${clientId}/`)
            .then(res => {
                setCliente(res.data);
                console.log('Perfil do cliente:', res.data); // Aqui sim vê os valores!
            })
            .catch(() => setError("Cliente não encontrado."))
            .finally(() => setLoading(false));
    }, [clientId]);


    // Avatar
    const isWoman = cliente?.genero === "F";
    const localAvatar = typeof ProfileImageMan === "string"
        ? (isWoman ? ProfileImageWoman : ProfileImageMan)
        : (isWoman ? ProfileImageWoman.src : ProfileImageMan.src);

    const profilePhoto =
        cliente?.imagem_perfil && cliente.imagem_perfil !== "nan"
            ? (cliente.imagem_perfil.startsWith("http")
                ? cliente.imagem_perfil
                : `${process.env.NEXT_PUBLIC_API_URL}${cliente.imagem_perfil}`)
            : localAvatar;

    if (loading) return <Spinner text="Carregando cliente..." />;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!cliente) return null;

    return (
        <ProfileContainer>
            <ProfileHeader>
                <ProfileImage
                    src={profilePhoto}
                    alt="Foto do Cliente"
                    width={120}
                    height={120}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <HeaderText>
                    <h2>
                        {cliente.nome} {cliente.sobre_nome}
                        <button
                            style={{
                                marginLeft: 16,
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                color: "#33cccc",
                                fontSize: 22,
                                display: "inline-flex",
                                alignItems: "center"
                            }}
                            title="Editar Dados do Cliente"
                            onClick={() => setDrawerOpen(true)}
                        >
                            <EditOutlined/>
                        </button>

                    </h2>
                    <StatusBadge
                        color={STATUS_DETAILS[cliente.status as StatusType]?.color}
                    >
                        {STATUS_DETAILS[cliente.status as StatusType]?.label || cliente.status}
                        {/* Adicione onClick para modal de alteração de status aqui se quiser */}
                    </StatusBadge>
                </HeaderText>
            </ProfileHeader>
            <CreationDate>
                Criado em: {cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : "N/A"}
            </CreationDate>
                <ClientTabs cliente={cliente} financeData={{
                    // Se quiser, depois pode puxar do backend: cliente.vida_financeira
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Renda Mensal',
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            data: [4000, 3000, 5000, 4000, 6000, 7000]
                        }
                    ]
                }} />
            {drawerOpen && (
                <EditClientDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    cliente={cliente}
                    onSave={dadosAtualizados => {
                        setDrawerOpen(false);
                        setCliente(dadosAtualizados); // Atualiza visualmente na tela!
                    }}
                />

            )}

        </ProfileContainer>
    );
}
