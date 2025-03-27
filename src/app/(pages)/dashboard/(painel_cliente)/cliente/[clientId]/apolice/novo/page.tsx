'use client'
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import ApoliceForm from '@/app/components/apolices/ApoliceForm';
import { createApolice, fetchApolices } from '@/store/slices/apoliceSlice';
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { fetchClienteDetalhe, updateClienteToActive } from '@/store/slices/clientesSlice';
import EditClientModal from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal';
import { Cliente } from '@/types/interfaces';

const NovaApolicePage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Extraindo clientId corretamente
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[pathSegments.length - 3];

    // Buscando clienteDetalhe do estado global
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [clientId, dispatch]);

    useEffect(() => {
        if (clienteDetalhe?.status === 'lead') {
            const camposObrigatorios: (keyof Cliente)[] = ['email', 'cpf', 'data_nascimento', 'genero', 'profissao'];
            const camposFaltantes = camposObrigatorios.filter(campo => !clienteDetalhe[campo]);

            if (camposFaltantes.length > 0) {
                setErrorMessage(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`);
                setIsModalOpen(true);
            }
        }
    }, [clienteDetalhe]);

    const handleSaveClient = async (updatedData: Partial<Cliente>) => {
        const fullData = {
            nome: clienteDetalhe?.nome,
            telefone: clienteDetalhe?.telefone,
            email: clienteDetalhe?.email,
            sexo: clienteDetalhe?.genero,
            ...updatedData
        };

        const updateResult = await dispatch(updateClienteToActive({ id: clientId, updatedCliente: fullData }));

        if (updateResult.meta.requestStatus === 'rejected') {
            setErrorMessage("Erro ao atualizar o cliente para ativo.");
        } else {
            setIsModalOpen(false);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            // ✅ Removendo `endpoint`
            const resultAction = await dispatch(createApolice({ formData }));

            if (createApolice.fulfilled.match(resultAction)) {
                await dispatch(fetchApolices({ cliente: clientId }));
                router.push(`/dashboard/cliente/${clientId}/apolice`);
            } else {
                setErrorMessage("Erro ao criar a apólice.");
            }
        } catch (error) {
            setErrorMessage("Erro inesperado ao criar a apólice.");
        }
    };

    return (
        <>
            {clienteDetalhe && !isModalOpen ? (
                <ApoliceForm
                    onSubmit={handleSubmit}
                    errorMessage={errorMessage}
                    clientName={clienteDetalhe?.nome}
                />
            ) : (
                <p>Carregando...</p>
            )}

            <EditClientModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialData={{
                    email: clienteDetalhe?.email || '',
                    telefone: clienteDetalhe?.telefone || '',
                    contatos_adicionais: clienteDetalhe?.contatos_adicionais || []
                }}
                onSave={handleSaveClient}
            />
        </>
    );
};

export default NovaApolicePage;
