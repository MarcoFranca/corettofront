// src/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/saude/ClientSaudeDetailsDrawer.tsx
'use client';
import React from "react";
import { Drawer, Button, Descriptions } from "antd";
import { HeartFilled } from "@ant-design/icons";

interface ClientSaudeDetailsDrawerProps {
    open: boolean;
    saude?: {
        peso?: string | number;
        altura?: string | number;
        imc?: string | number;
        imc_grau?: string;
        doenca_preexistente?: string;
        tem_doenca_preexistente?: boolean;
        historico_familiar_doencas?: string;
        tem_historico_familiar_doencas?: boolean;
    } | null;
    onClose: () => void;
    onEditClick: () => void;
}

const ClientSaudeDetailsDrawer: React.FC<ClientSaudeDetailsDrawerProps> = ({
                                                                               open,
                                                                               saude,
                                                                               onClose,
                                                                               onEditClick,
                                                                           }) => {
    if (!saude) {
        return (
            <Drawer open={open} onClose={onClose} width={500} title="Dados de Saúde">
                <p style={{ color: "#b8beca" }}>Nenhum dado de saúde cadastrado.</p>
                <Button type="primary" onClick={onEditClick}>Adicionar/Editar Saúde</Button>
            </Drawer>
        );
    }

    return (
        <Drawer open={open} onClose={onClose} width={500} title={<><HeartFilled style={{ color: "#ff6b6b" }} /> Saúde do Cliente</>}>
            <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Peso">{saude.peso} kg</Descriptions.Item>
                <Descriptions.Item label="Altura">{saude.altura} m</Descriptions.Item>
                <Descriptions.Item label="IMC">{saude.imc} ({saude.imc_grau})</Descriptions.Item>
                <Descriptions.Item label="Doença Preexistente">{saude.doenca_preexistente || "Não"}</Descriptions.Item>
                <Descriptions.Item label="Tem Doença Preexistente">{saude.tem_doenca_preexistente ? "Sim" : "Não"}</Descriptions.Item>
                <Descriptions.Item label="Histórico Familiar">{saude.historico_familiar_doencas || "Não informado"}</Descriptions.Item>
                <Descriptions.Item label="Tem Histórico Familiar">{saude.tem_historico_familiar_doencas ? "Sim" : "Não"}</Descriptions.Item>
            </Descriptions>
            <Button style={{ marginTop: 20 }} type="primary" onClick={onEditClick}>Editar Saúde</Button>
        </Drawer>
    );
}

export default ClientSaudeDetailsDrawer;
