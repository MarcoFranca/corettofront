'use client';

import React from 'react';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { Descriptions, Tag } from 'antd';

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
}

const NegociacaoDadosTab: React.FC<Props> = ({ cliente }) => {
    return (
        <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Nome completo">
                {cliente.nome} {cliente.sobre_nome}
            </Descriptions.Item>
            <Descriptions.Item label="CPF">
                {cliente.cpf || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Identidade">
                {cliente.identidade || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Data de nascimento">
                {cliente.data_nascimento
                    ? `${new Date(cliente.data_nascimento).toLocaleDateString("pt-BR")} ${cliente.idade ? `(${cliente.idade} anos)` : ""}`
                    : "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Gênero">
                {cliente.genero === "M" ? "Masculino" : cliente.genero === "F" ? "Feminino" : "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Profissão">
                {cliente.profissao?.nome || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">
                {cliente.telefone || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">
                {cliente.email || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado Civil">
                {cliente.estado_civil || "Não informado"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
                <Tag color="blue">{cliente.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status Reunião">
                {cliente.status_reuniao
                    ? <Tag color="purple">{cliente.status_reuniao}</Tag>
                    : "Não definido"}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default NegociacaoDadosTab;
