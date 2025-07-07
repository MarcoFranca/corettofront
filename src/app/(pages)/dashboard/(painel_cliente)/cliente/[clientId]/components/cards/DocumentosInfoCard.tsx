// components/cards/DocumentosInfoCard.tsx
'use client';
import React from "react";
import { IdcardOutlined, FileTextOutlined, CopyOutlined, UserOutlined } from "@ant-design/icons";
import { Tooltip, Button, Tag } from "antd";
import { InfoCard, CardTitle, CardValue } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/ClientDetailPage.styles";
import {formatCPFOrCNPJ, formatIdentidade, getIdentityMask} from "@/utils/maskUtils"; // Use sua função de máscara de CPF!

interface Props {
    cpf?: string;
    identidade?: string;
    tipoIdentidade?: string;
    onClick?: () => void;
}

const DocumentosInfoCard: React.FC<Props> = ({ cpf, identidade, tipoIdentidade, onClick }) => (
    <InfoCard $clickable={!!onClick} onClick={onClick}>
        <CardTitle>
            <IdcardOutlined style={{ color: "#33cccc", fontSize: 23, marginRight: 7 }} />
            <span style={{ fontWeight: 700, color: "#042a75", fontSize: 18, letterSpacing: 1 }}>Documentos</span>
        </CardTitle>
        <CardValue>
            {/* CPF */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, marginBottom: 4 }}>
                <FileTextOutlined style={{ color: "#042a75", fontSize: 17 }} />
                <span style={{ fontWeight: 500 }}>CPF:</span>
                <span>
                    {cpf ? (
                        <Tag color="blue" style={{ fontSize: 15, marginRight: 0 }}>{formatCPFOrCNPJ(cpf)}</Tag>
                    ) : (
                        <span style={{ color: "#b8beca" }}>Não informado</span>
                    )}
                </span>
                {cpf && (
                    <Tooltip title="Copiar CPF">
                        <Button
                            icon={<CopyOutlined />}
                            size="small"
                            style={{ border: "none", marginLeft: 2 }}
                            onClick={e => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(formatCPFOrCNPJ(cpf));
                            }}
                        />
                    </Tooltip>
                )}
            </div>
            {/* Identidade */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16 }}>
                <UserOutlined style={{ color: "#042a75", fontSize: 17 }} />
                <span style={{ fontWeight: 500 }}>Id:</span>
                <span>
                {tipoIdentidade && (
                    <Tag color="cyan" style={{ fontSize: 13, marginLeft: 8 }}>
                        {tipoIdentidade}
                    </Tag>
                )}
                    {identidade ? (
                        <Tag color="geekblue" style={{ fontSize: 15, marginRight: 0 }}>
                            {formatIdentidade(identidade, tipoIdentidade)}
                        </Tag>
                    ) : (
                        <span style={{ color: "#b8beca" }}>Não informado</span>
                    )}
                    {identidade && (
                        <Tooltip title="Copiar Identidade">
                            <Button
                                icon={<CopyOutlined />}
                                size="small"
                                style={{ border: "none", marginLeft: 2 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(identidade);
                                }}
                            />
                        </Tooltip>
                    )}
                </span>
            </div>
        </CardValue>
    </InfoCard>
);

export default DocumentosInfoCard;
