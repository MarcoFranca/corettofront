"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchApolices, deleteApolice } from "@/store/slices/apoliceSlice";
import { fetchClienteDetalhe } from "@/store/slices/clientesSlice";
import { useParams } from "next/navigation"; // 🔥 Correção aqui!
import ApoliceTable from "./(component)/ApoliceTable";
import ApoliceFilter from "./(component)/ApoliceFilter";
import Link from "next/link";
import Button from "@/app/components/ui/Button";

const ClienteApolicesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { clientId } = useParams(); // 🔥 Pega o ID do cliente corretamente

    const clienteDetalhe = useAppSelector((state) => state.clientes.clienteDetalhe);
    const apolices = useAppSelector((state) => state.apolices.apolices);
    const status = useAppSelector((state) => state.apolices.status);

    const [filtro, setFiltro] = useState("todos");

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId as string));
            dispatch(fetchApolices({ clientId: clientId as string }));
        }
    }, [clientId, dispatch]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Apólices de {clienteDetalhe?.nome}</h1>
                <Link href={`/clientes/${clientId}/nova-apolice`}>
                    <Button>+ Nova Apólice</Button>
                </Link>
            </div>
            <ApoliceFilter setFiltro={setFiltro} />
            <ApoliceTable apolices={apolices} filtro={filtro} clienteId={clientId as string} />
        </div>
    );
};

export default ClienteApolicesPage;
