'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import ApoliceForm from '@/app/components/apolices/ApoliceForm';
import { createApolice } from '@/store/slices/apoliceSlice';
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { fetchClienteDetalhe } from '@/store/slices/clientesSlice';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";

const NovaApolicePage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Extraindo corretamente o clientId da URL
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[pathSegments.length - 3];

    // Buscando o clienteDetalhe do estado global
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    // console.log(clienteDetalhe);
    // const nome = clienteDetalhe?.nome || '';
    console.log(clienteDetalhe?.nome);


    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));  // Buscando os detalhes do cliente
        }
    }, [clientId, dispatch]);

    const handleSubmit = async (data: any, endpoint: string) => {
        if (!clientId) {
            setErrorMessage("ID do cliente não encontrado.");
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            const resultAction = await dispatch(createApolice({ clientId, formData, endpoint }));

            if (createApolice.fulfilled.match(resultAction)) {
                router.push(`/dashboard/cliente/${clientId}/apolice`);
            } else if (createApolice.rejected.match(resultAction)) {
                // Aqui você pode transformar o erro em uma string
                const errorPayload = resultAction.payload;
                if (errorPayload && typeof errorPayload === 'object') {
                    const errorMessages = Object.values(errorPayload).join(", ");
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage(resultAction.payload || "Erro ao criar a apólice.");
                }
            }
        } catch (error) {
            setErrorMessage("Erro inesperado ao criar a apólice.");
            console.error("Erro ao criar apólice:", error);
        }
    };


    return (
        <ClienteDashboardLayout clientId={clientId}>
        {clienteDetalhe ? (
                <ApoliceForm
                    onSubmit={handleSubmit}
                    errorMessage={errorMessage}
                    clientName={clienteDetalhe?.nome}  // Passando o nome do cliente para o formulário
                />
            ) : (
                <p>Carregando...</p>  // Mostrando uma mensagem enquanto carrega os detalhes do cliente
            )}
        </ClienteDashboardLayout>
    );
};

export default NovaApolicePage;
