'use client';
import React from "react";
import { Drawer, Button, Space, Tooltip, Tag } from "antd";
import {
    HomeOutlined, CopyOutlined, EnvironmentOutlined, NumberOutlined, ApartmentOutlined, PushpinOutlined, EditOutlined
} from "@ant-design/icons";
import styled from "styled-components";

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  font-size: 16px;
  gap: 12px;
`;

interface Props {
    open: boolean;
    endereco?: {
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        cidade?: string;
        uf?: string;
        cep?: string;
    };
    onClose: () => void;
    onEditClick: () => void;
}

function formatCEP(cep?: string) {
    if (!cep) return "";
    const digits = cep.replace(/\D/g, "");
    return digits.length === 8 ? digits.replace(/^(\d{5})(\d{3})$/, "$1-$2") : cep;
}

const ClientAddressDetailsDrawer: React.FC<Props> = ({
                                                         open, endereco, onClose, onEditClick
                                                     }) => {
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
        <Drawer
            title={
            <Space>
            <HomeOutlined /> Detalhes do Endereço
    </Space>
}
    open={open}
    onClose={onClose}
    width={480}
    destroyOnClose
    extra={
        <Button icon={<EditOutlined />} onClick={onEditClick} type="primary">
        Editar Endereço
    </Button>
}
>
    <InfoLine>
        <EnvironmentOutlined style={{ color: "#33cccc" }} />
    <strong>Logradouro:</strong>
    <span>{logradouro || <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
    </InfoLine>
    <InfoLine>
    <NumberOutlined style={{ color: "#33cccc" }} />
    <strong>Número:</strong>
    <span>{numero || <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
    </InfoLine>
    <InfoLine>
    <ApartmentOutlined style={{ color: "#33cccc" }} />
    <strong>Complemento:</strong>
    <span>{complemento || <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
    </InfoLine>
    <InfoLine>
    <HomeOutlined style={{ color: "#33cccc" }} />
    <strong>Bairro:</strong>
    <span>{bairro || <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
    </InfoLine>
    <InfoLine>
    <PushpinOutlined style={{ color: "#33cccc" }} />
    <strong>Cidade:</strong>
    <span>{cidade || <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
    {uf && <Tag color="blue" style={{ marginLeft: 8 }}>{uf}</Tag>}
    </InfoLine>
    <InfoLine>
    <PushpinOutlined style={{ color: "#33cccc" }} />
    <strong>CEP:</strong>
    <span>{cep ? formatCEP(cep) : <span style={{ color: "#b8beca" }}>Não informado</span>}</span>
    </InfoLine>
    {/* Botão de copiar endereço completo */}
    <InfoLine>
        <Tooltip title="Copiar endereço completo">
    <Button
        icon={<CopyOutlined />}
    size="small"
    style={{ border: "none" }}
    onClick={copyAddress}
        >
        Copiar endereço
    </Button>
    </Tooltip>
    </InfoLine>
    </Drawer>
);
};

    export default ClientAddressDetailsDrawer;
