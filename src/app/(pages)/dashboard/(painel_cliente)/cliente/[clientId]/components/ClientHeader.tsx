import React from "react";
import { Avatar, Tag, Tooltip } from "antd";
import {
    StarFilled, CalendarOutlined, DollarOutlined, UserOutlined
} from "@ant-design/icons";
import { Cliente } from "@/types/interfaces";
import {
    BadgeStatus,
    HeaderWrap,
    LeftBlock,
    MainInfo, Pipeline, RightContainer, TopRow
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/ClientHeader.styles";
import {
    getProximaReuniao,
    getTotalApolicesValor,
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/helpers/functions";
import QuickActions from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/components/QuickActions";
// Mock helpers (substitua por dados reais)
const ClientHeaderPremium: React.FC<{ cliente: Cliente; onEdit: () => void; onNovaApolice: () => void;
    onWhatsApp: () => void; onNovaReuniao: () => void; onNegociacao: () => void;
}> = ({ cliente, onEdit, onNovaApolice, onWhatsApp, onNovaReuniao, onNegociacao }) => {

    const imageUrl =
        cliente.imagem_perfil && cliente.imagem_perfil !== "nan"
            ? (cliente.imagem_perfil.startsWith("http")
                ? cliente.imagem_perfil
                : `${process.env.NEXT_PUBLIC_API_URL}${cliente.imagem_perfil}`)
            : undefined;

    const proximaReuniao = getProximaReuniao(cliente);

    return (
        <HeaderWrap>
            <LeftBlock>
                {/* Avatar e VIP */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Avatar
                        size={86}
                        src={imageUrl}
                        style={{
                            border: "3px solid #33cccc",
                            background: "#f3f6fc",
                            color: "#33cccc",
                            fontSize: 44,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <UserOutlined />
                    </Avatar>

                    {cliente.is_vip && (
                        <StarFilled
                            style={{
                                color: "#ffd700",
                                position: "absolute",
                                top: -6,
                                right: -8,
                                fontSize: 28,
                                textShadow: "0 2px 7px #ffe07e"
                            }}
                            title="Cliente VIP"
                        />
                    )}
                </div>

                {/* Info principal */}
                <MainInfo>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Tooltip
                            title={
                                <>
                                    Criado
                                    em: <b>{cliente.created_at && new Date(cliente.created_at).toLocaleDateString()}</b><br/>
                                    Atualizado
                                    em: <b>{cliente.updated_at && new Date(cliente.updated_at).toLocaleDateString()}</b>
                                </>
                            }
                        >
                            <TopRow>
                              <span style={{ fontSize: 26, fontWeight: 700, color: "#042a75" }}>
                                {cliente.nome} {cliente.sobre_nome}
                              </span>
                                {cliente.is_vip && (
                                    <>
                                        <Tag color="yellow" style={{ marginLeft: 4, fontWeight: 600 }}>VIP</Tag>
                                    </>
                                )}
                                {cliente.idade && <Tag color="blue" style={{ marginLeft: 6 }}>{cliente.idade} anos</Tag>}
                            </TopRow>

                        </Tooltip>
                    </div>
                    {/* Badges de status/contexto */}
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>

                        <BadgeStatus
                            color={cliente.status === "ativo" ? "green" : cliente.status === "lead" ? "blue" : "orange"}>
                            {cliente.status?.charAt(0).toUpperCase() + cliente.status?.slice(1)}
                        </BadgeStatus>
                        {cliente.ja_foi_cliente && (
                            <BadgeStatus color="gold">Cliente Antigo</BadgeStatus>
                        )}
                        {!cliente.possui_apolice_ativa && cliente.ja_foi_cliente && (
                            <BadgeStatus color="volcano">Inativo</BadgeStatus>
                        )}
                        {cliente.possui_apolice_ativa && (
                            <BadgeStatus color="cyan">Apólice Ativa</BadgeStatus>
                        )}
                        {/* Outras badges úteis (ex: lead novo, reativação pendente) */}
                    </div>

                </MainInfo>
            </LeftBlock>

            {/* Pipeline visual */}
            <RightContainer>

            <MainInfo>
                <Pipeline>
                    <span style={{ fontWeight: 600, color: "#bbb" }}>Funil:</span>
                    <Tag color={cliente.status === "lead" ? "blue" : ""}>Lead</Tag>
                    <span>→</span>
                    <Tag color={cliente.status === "negociacao" ? "gold" : ""}>Negociação</Tag>
                    <span>→</span>
                    <Tag color={cliente.status === "ativo" ? "green" : ""}>Ativo</Tag>
                    <span>→</span>
                    <Tag color={cliente.status === "inativo" ? "orange" : ""}>Inativo</Tag>
                </Pipeline>

                {/* Resumo apólices + próxima reunião */}
                <div style={{ display: "flex", alignItems: "center", gap: 17 }}>
                        <span>
                            <DollarOutlined style={{ color: "#33cccc", fontSize: 18, marginRight: 4 }} />
                            <b>{cliente.total_apolices}</b> apólice(s) ativa(s)
                        </span>
                    <span style={{ color: "#888" }}>{getTotalApolicesValor(cliente)}</span>
                    {proximaReuniao ? (
                        <Tag color="purple" icon={<CalendarOutlined />}>
                            Próx. reunião: {new Date(proximaReuniao.data).toLocaleDateString("pt-BR")}
                        </Tag>
                    ) : (
                        <Tag color="purple" icon={<CalendarOutlined />}>
                            Sem reunião agendada
                        </Tag>
                    )}

                </div>
            </MainInfo>

            {/* Atalhos inteligentes */}
                <QuickActions
                    onNovaApolice={onNovaApolice}
                    onWhatsApp={onWhatsApp}
                    onNovaReuniao={onNovaReuniao}
                    onEdit={onEdit}
                    onNegociacao={onNegociacao}
                />
            </RightContainer>

        </HeaderWrap>
    );
};

export default ClientHeaderPremium;
