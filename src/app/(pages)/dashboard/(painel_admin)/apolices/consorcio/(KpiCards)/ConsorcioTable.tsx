"use client";

import React from "react";
import { Table } from "antd";
import { ApoliceConsorcio } from "@/types/ApolicesInterface";

interface ConsorcioTableProps {
    apolices: ApoliceConsorcio[];
    setApolices: React.Dispatch<React.SetStateAction<ApoliceConsorcio[]>>;
}

const ConsorcioTable: React.FC<ConsorcioTableProps> = ({ apolices }) => {
    const columns = [
        {
            title: "Número da Apólice",
            dataIndex: "numero_apolice",
            key: "numero_apolice",
        },
        {
            title: "Cliente",
            dataIndex: "cliente_nome",
            key: "cliente_nome",
        },
        {
            title: "Administradora",
            dataIndex: "administradora",
            key: "administradora",
        },
        {
            title: "Grupo",
            dataIndex: "grupo",
            key: "grupo",
        },
        {
            title: "Cota",
            dataIndex: "cota",
            key: "cota",
        },
        {
            title: "Valor da Carta",
            dataIndex: "valor_carta",
            key: "valor_carta",
            render: (valor: number) => `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
    ];

    return <Table dataSource={apolices} columns={columns} rowKey={(record) => record.id} />;
};

export default ConsorcioTable;
