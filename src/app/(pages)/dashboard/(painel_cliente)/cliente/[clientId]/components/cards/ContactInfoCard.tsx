// components/ContactInfoCard.tsx
'use client';
import React from "react";
import { Tooltip, Button } from "antd";
import { PhoneOutlined, CopyOutlined } from "@ant-design/icons";
import { formatPhoneNumber } from "@/utils/maskUtils"; // Caminho do seu helper
import { InfoCard, CardTitle, CardValue } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/ClientDetailPage.styles";

interface Props {
    telefone?: string;
    email?: string;
    onClick?: () => void;
}

const ContactInfoCard: React.FC<Props> = ({ telefone, email, onClick }) => {
    const formattedPhone = formatPhoneNumber(telefone);

    return (
        <InfoCard $clickable onClick={onClick}>
            <CardTitle>
                <PhoneOutlined style={{ color: "#33cccc", fontSize: 18, marginRight: 4 }} />
                <span style={{ fontWeight: 600, color: "#042a75" }}>Contato</span>
            </CardTitle>
            <CardValue>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>
                        {formattedPhone || <span style={{ color: "#b8beca" }}>Sem telefone</span>}
                    </span>
                    {telefone && telefone.replace(/\D/g, "").length >= 11 && (
                        <Tooltip title="WhatsApp">
                            <PhoneOutlined style={{ color: "#25d366", fontSize: 18 }} />
                        </Tooltip>
                    )}
                    {telefone && (
                        <Tooltip title="Copiar telefone">
                            <Button
                                icon={<CopyOutlined />}
                                size="small"
                                style={{ border: "none" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(formattedPhone);
                                }}
                            />
                        </Tooltip>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 15 }}>
                        {email || <span style={{ color: "#b8beca" }}>Sem e-mail</span>}
                    </span>
                    {email && (
                        <Tooltip title="Copiar e-mail">
                            <Button
                                icon={<CopyOutlined />}
                                size="small"
                                style={{ border: "none" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(email);
                                }}
                            />
                        </Tooltip>
                    )}
                </div>
            </CardValue>
        </InfoCard>
    );
};

export default ContactInfoCard;
