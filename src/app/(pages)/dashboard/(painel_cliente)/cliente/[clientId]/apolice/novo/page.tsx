'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import ApoliceForm from '@/app/components/apolices/ApoliceForm';
import { createApolice, fetchApolices } from '@/store/slices/apoliceSlice'; // Import fetchApolices
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { fetchClienteDetalhe, updateClienteToActive } from '@/store/slices/clientesSlice';
import EditClientModal from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal'; // Importando o modal
import { Cliente } from '@/types/interfaces'; // Certifique-se de importar o tipo Cliente

const NovaApolicePage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Controle do modal

    // Extraindo corretamente o clientId da URL
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[pathSegments.length - 3];

    // Buscando o clienteDetalhe do estado global
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));  // Buscando os detalhes do cliente
        }
    }, [clientId, dispatch]);

    useEffect(() => {
        // Verifica os campos obrigatórios quando o cliente é carregado
        if (clienteDetalhe?.status === 'lead') {
            const camposObrigatorios: (keyof Cliente)[] = ['email', 'cpf', 'data_nascimento', 'genero', 'profissao'];
            const camposFaltantes = camposObrigatorios.filter(campo => !clienteDetalhe[campo]);

            if (camposFaltantes.length > 0) {
                setErrorMessage(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`);
                setIsModalOpen(true);  // Abre o modal automaticamente ao carregar a página
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

    const handleSubmit = async (data: any, endpoint: string) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            const resultAction = await dispatch(createApolice({ clientId, formData, endpoint }));

            if (createApolice.fulfilled.match(resultAction)) {
                // Atualiza a lista de apólices após o cadastro
                await dispatch(fetchApolices({ clientId }));

                // Redireciona para a página de apólices
                router.push(`/dashboard/cliente/${clientId}/apolice`);
            } else if (createApolice.rejected.match(resultAction)) {
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
                initialData={clienteDetalhe}
                onSave={handleSaveClient}
                title="Preencha os dados obrigatórios para cadastrar a apólice"
                requiredFields={['email', 'cpf', 'data_nascimento', 'sexo', 'profissao']}
            />
        </>
    );
};

export default NovaApolicePage;
