"use client";

import React from "react";
import { Table } from "antd";
import { ApoliceSeguroVida } from "@/types/ApolicesInterface";
import { formatCurrency } from "@/utils/maskUtils";

interface SeguroVidaTableProps {
    apolices: ApoliceSeguroVida[];
    setApolices: React.Dispatch<React.SetStateAction<ApoliceSeguroVida[]>>;
}

const SeguroVidaTable: React.FC<SeguroVidaTableProps> = ({ apolices }) => {
    const columns = [
        {
            title: "Número",
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
            dataIndex: "administradora_nome",
            key: "administradora_nome",
        },
        {
            title: "Capital Segurado",
            dataIndex: "capital_segurado_total",
            key: "Valor Segurado",
            render: (valor: number) => formatCurrency(valor),
        },
        {
            title: "Forma Pagamento",
            dataIndex: "forma_pagamento",
            key: "forma_pagamento",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
    ];

    return <Table dataSource={apolices} columns={columns} rowKey="id" />;
};

export default SeguroVidaTable;
