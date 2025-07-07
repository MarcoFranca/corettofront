// components/cards/AddressInfoCard.tsx
'use client';
import React from "react";
import { HomeOutlined, CopyOutlined, PushpinOutlined, EnvironmentOutlined, NumberOutlined } from "@ant-design/icons";
import { Tooltip, Button, Tag } from "antd";
import { InfoCard, CardTitle, CardValue } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/ClientDetailPage.styles";

interface Props {
    endereco?: {
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        cidade?: string;
        uf?: string;
        cep?: string;
    };
    onClick?: () => void;
}

function formatCEP(cep?: string) {
    if (!cep) return "";
    const digits = cep.replace(/\D/g, "");
    return digits.length === 8 ? digits.replace(/^(\d{5})(\d{3})$/, "$1-$2") : cep;
}

const AddressInfoCard: React.FC<Props> = ({ endereco, onClick }) => {
    const {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        cep
    } = endereco || {};

    const copyAddress = () => {
        const text = `${logradouro || ""}, ${numero || ""}${complemento ? " - " + complemento : ""} - ${bairro || ""}, ${cidade || ""} - ${uf || ""}, ${formatCEP(cep)}`;
        navigator.clipboard.writeText(text.trim());
    };

    return (
        <InfoCard $clickable={!!onClick} onClick={onClick}>
            <CardTitle>
                <HomeOutlined style={{ color: "#33cccc", fontSize: 20, marginRight: 6 }} />
                <span style={{ fontWeight: 600, color: "#042a75" }}>Endereço</span>
            </CardTitle>
            <CardValue>
                {logradouro ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span>
                            <EnvironmentOutlined style={{ color: "#aaa" }} /> <b>{logradouro}</b>
                            {numero && (
                                <> <NumberOutlined style={{ color: "#aaa", marginLeft: 8 }} /> {numero}</>
                            )}
                            {complemento && (
                                <> • <span style={{ color: "#888" }}>{complemento}</span></>
                            )}
                        </span>
                        <span>
                            {bairro && <>{bairro}, </>}
                            {cidade && <>{cidade} </>}
                            {uf && <Tag color="blue" style={{ marginLeft: 6 }}>{uf}</Tag>}
                        </span>
                        {cep && (
                            <span>
                                <PushpinOutlined style={{ color: "#33cccc", marginRight: 3 }} />
                                CEP: <b>{formatCEP(cep)}</b>
                            </span>
                        )}
                        <Tooltip title="Copiar endereço completo">
                            <Button
                                icon={<CopyOutlined />}
                                size="small"
                                style={{ border: "none", marginTop: 6 }}
                                onClick={e => {
                                    e.stopPropagation();
                                    copyAddress();
                                }}
                            />
                        </Tooltip>
                    </div>
                ) : (
                    <span style={{ color: "#b8beca" }}>Não cadastrado</span>
                )}
            </CardValue>
        </InfoCard>
    );
};

export default AddressInfoCard;
