'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import ApoliceForm from '@/app/components/apolices/ApoliceForm';
import { createApolice } from '@/store/slices/apoliceSlice';
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { fetchClienteDetalhe, updateClienteToActive } from '@/store/slices/clientesSlice';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";
import EditClientModal from '@/app/components/Modal/profile/EditClientModal'; // Importando o modal
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
            // Campos obrigatórios devem ser acessados com chave que corresponde às propriedades do tipo Cliente
            const camposObrigatorios: (keyof Cliente)[] = ['email', 'cpf', 'data_nascimento', 'sexo', 'profissao'];
            const camposFaltantes = camposObrigatorios.filter(campo => !clienteDetalhe[campo]);

            if (camposFaltantes.length > 0) {
                setErrorMessage(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`);
                setIsModalOpen(true);  // Abre o modal automaticamente ao carregar a página
            }
        }
    }, [clienteDetalhe]);

    const handleSaveClient = async (updatedData: Partial<Cliente>) => {
        // Combine os dados obrigatórios já existentes com os dados atualizados
        const fullData = {
            nome: clienteDetalhe?.nome,         // Incluindo o nome existente
            telefone: clienteDetalhe?.telefone, // Incluindo o telefone existente
            email: clienteDetalhe?.email,       // Incluindo o email existente
            sexo: clienteDetalhe?.sexo,         // Incluindo o sexo existente
            ...updatedData                      // Incluindo os novos dados preenchidos no modal
        };

        console.log('Dados enviados ao backend:', fullData);  // Log dos dados enviados

        const updateResult = await dispatch(updateClienteToActive({ id: clientId, updatedCliente: fullData }));

        if (updateResult.meta.requestStatus === 'rejected') {
            setErrorMessage("Erro ao atualizar o cliente para ativo.");
            console.log('Erro no backend:', updateResult.payload);  // Log do erro
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
                router.push(`/dashboard/cliente/${clientId}/apolice`);
            } else if (createApolice.rejected.match(resultAction)) {
                setErrorMessage("Erro ao criar a apólice.");
            }
        } catch (error) {
            setErrorMessage("Erro inesperado ao criar a apólice.");
        }
    };

    return (
        <ClienteDashboardLayout clientId={clientId}>
            {clienteDetalhe && !isModalOpen ? (
                <ApoliceForm
                    onSubmit={handleSubmit}
                    errorMessage={errorMessage}
                    clientName={clienteDetalhe?.nome}
                />
            ) : (
                <p>Carregando...</p>
            )}

            {/* Modal para capturar os campos faltantes */}
            <EditClientModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialData={clienteDetalhe}
                onSave={handleSaveClient}
                title="Preencha os dados obrigatórios para cadastrar a apólice"
                requiredFields={['email', 'cpf', 'data_nascimento', 'sexo', 'profissao']}
            />
        </ClienteDashboardLayout>
    );
};

export default NovaApolicePage;
