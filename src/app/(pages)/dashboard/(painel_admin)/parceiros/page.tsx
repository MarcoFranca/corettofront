"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Drawer } from "antd";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import { fetchParceiros } from "@/store/slices/parceirosSlice";
import { FaPlus, FaEye } from "react-icons/fa";
import ParceiroWizard from "@/app/components/forms/parceiros/ParceiroWizard";
import {Container} from "@/app/(pages)/dashboard/(painel_admin)/parceiros/Parceiros.styles";

interface Cliente {
    id: string;
    nome: string;
}

interface Parceiro {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
    clientes_indicados: Cliente[];
}

const ParceirosPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const parceiros: Parceiro[] = useAppSelector((state) => state.parceiros.parceiros);
    const [search, setSearch] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchParceiros());
    }, [dispatch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        dispatch(fetchParceiros()); // 🔄 Atualiza a lista após cadastro
    };

    const filteredParceiros = parceiros.filter((parceiro) =>
        parceiro.nome.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { title: "Nome", dataIndex: "nome", key: "nome" },
        { title: "Telefone", dataIndex: "telefone", key: "telefone" },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Clientes Indicados",
            dataIndex: "clientes_indicados",
            key: "clientes_indicados",
            render: (clientes: Cliente[]) =>
                clientes.length > 0
                    ? <p>
                    {clientes.length}
                    </p>
                    : "Nenhum",
        },
        {
            title: "Ações",
            key: "actions",
            render: (_: unknown, record: Parceiro) => (
                <Button icon={<FaEye />} onClick={() => router.push(`/dashboard/parceiros/${record.id}`)}>
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <Container>
            <h2>Parceiros</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Input
                    placeholder="Buscar parceiro..."
                    value={search}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<FaPlus />} onClick={() => setIsDrawerOpen(true)}>
                    Novo Parceiro
                </Button>
            </div>
            <Table dataSource={filteredParceiros} columns={columns} rowKey="id" />

            {/* 📌 Drawer para Cadastro */}
            <Drawer open={isDrawerOpen} onClose={handleCloseDrawer} width="40vw">
                <ParceiroWizard onClose={handleCloseDrawer} />
            </Drawer>
        </Container>
    );
};

export default ParceirosPage;
