'use client';
import React from "react";
import { Drawer, Button, Tag, Tooltip, Space } from "antd";
import {
    PhoneOutlined, MailOutlined, WhatsAppOutlined, CopyOutlined, UserOutlined, HomeOutlined, EditOutlined
} from "@ant-design/icons";
import styled from "styled-components";
import { Cliente, ContatoAdicional } from "@/types/interfaces";
import { formatPhoneNumber } from "@/utils/maskUtils";

const contatoTypes = [
    { value: "celular", label: "Celular", icon: <PhoneOutlined /> },
    { value: "comercial", label: "Comercial", icon: <UserOutlined /> },
    { value: "residencial", label: "Residencial", icon: <HomeOutlined /> },
    { value: "outro", label: "Outro", icon: <UserOutlined /> },
];

// Styled para área visual
const InfoLine = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    font-size: 16px;
    gap: 10px;
`;

const BadgeWhatsapp = styled.span`
  background: #25d36622;
  color: #25d366;
  border-radius: 5px;
  padding: 2px 8px;
  margin-left: 8px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
`;

interface Props {
    open: boolean;
    cliente: Cliente;
    onClose: () => void;
    onEditClick: () => void; // Ação para editar (abre drawer/modal)
}

const ClientContactDetailsDrawer: React.FC<Props> = ({
                                                         open, cliente, onClose, onEditClick
                                                     }) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const isWhatsapp = (num: string) => num && num.replace(/\D/g, "").length >= 11;

    return (
        <Drawer
            title={
                <Space>
                    <PhoneOutlined /> Detalhes de Contato
                </Space>
            }
            open={open}
            onClose={onClose}
            width={550}
            destroyOnClose
            extra={
                <Button
                    icon={<EditOutlined />}
                    onClick={onEditClick}
                    type="primary"
                >
                    Editar contatos
                </Button>
            }
        >
            <InfoLine>
                <PhoneOutlined />
                <strong>Telefone principal:</strong>
                <span style={{ fontSize: 18 }}>{formatPhoneNumber(cliente.telefone)}</span>
                <Tooltip title="Copiar telefone">
                    <Button icon={<CopyOutlined />} size="small"
                            onClick={() => copyToClipboard(cliente.telefone)} />
                </Tooltip>
                {isWhatsapp(cliente.telefone) && (
                    <BadgeWhatsapp>
                        <WhatsAppOutlined style={{ marginRight: 2 }} />
                        WhatsApp
                    </BadgeWhatsapp>
                )}
                <Tooltip title="Abrir WhatsApp">
                    <Button
                        icon={<WhatsAppOutlined />}
                        size="small"
                        type="link"
                        onClick={() => window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`, "_blank")}
                    />
                </Tooltip>
            </InfoLine>

            <InfoLine>
                <MailOutlined />
                <strong>E-mail:</strong>
                <span>{cliente.email || <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
                {cliente.email && (
                    <Tooltip title="Copiar e-mail">
                        <Button icon={<CopyOutlined />} size="small"
                                onClick={() => copyToClipboard(cliente.email)} />
                    </Tooltip>
                )}
            </InfoLine>

            <InfoLine>
                <UserOutlined />
                <strong>Contato preferido:</strong>
                <Tag color="blue" style={{ fontWeight: 500, marginLeft: 6 }}>
                    {cliente.contato_preferido === "telefone" && <PhoneOutlined />}
                    {cliente.contato_preferido === "whatsapp" && <WhatsAppOutlined />}
                    {cliente.contato_preferido === "email" && <MailOutlined />}
                    <span style={{ marginLeft: 4 }}>
        {cliente.contato_preferido
            ? cliente.contato_preferido.charAt(0).toUpperCase() + cliente.contato_preferido.slice(1)
            : <span style={{ color: "#b8beca" }}>Não informado</span>
        }
    </span>
                </Tag>

            </InfoLine>

            <div style={{ margin: "22px 0 12px", fontWeight: 500 }}>
                <UserOutlined /> Contatos adicionais:
            </div>
            <div>
                {cliente.relacionamentos?.contatos_adicionais && cliente.relacionamentos.contatos_adicionais.length > 0 ? (
                    cliente.relacionamentos.contatos_adicionais.map((contato, idx) => (
                        <Tag color="geekblue" key={contato.id || idx} style={{ marginBottom: 6, fontSize: 15 }}>
                            <span style={{ marginRight: 6 }}>
                                {contatoTypes.find(t => t.value === contato.tipo)?.icon}
                            </span>
                            {formatPhoneNumber(contato.valor)}
                            <span style={{ fontSize: 12, marginLeft: 5 }}>({contato.tipo})</span>
                            <Tooltip title="Copiar">
                                <Button
                                    icon={<CopyOutlined />}
                                    size="small"
                                    style={{ marginLeft: 4 }}
                                    type="link"
                                    onClick={() => copyToClipboard(contato.valor)}
                                />
                            </Tooltip>
                            {(contato.tipo === "celular" || contato.tipo === "comercial") && (
                                <Tooltip title="WhatsApp">
                                    <Button
                                        icon={<WhatsAppOutlined />}
                                        size="small"
                                        type="link"
                                        onClick={() => window.open(`https://wa.me/55${contato.valor.replace(/\D/g, "")}`, "_blank")}
                                    />
                                </Tooltip>
                            )}
                        </Tag>
                    ))
                ) : (
                    <span style={{ color: "#b8beca" }}>Nenhum contato adicional</span>
                )}
            </div>
        </Drawer>
    );
};

export default ClientContactDetailsDrawer;
