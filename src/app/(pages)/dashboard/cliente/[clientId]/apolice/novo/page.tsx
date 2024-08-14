'use client'
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch } from '@/hooks/hooks';
import ApoliceForm from '@/app/components/apolices/ApoliceForm';
import { createApolice } from '@/store/slices/apoliceSlice';

const NovaApolicePage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    // Extraindo corretamente o clientId da URL
    const pathSegments = pathname.split('/');
    const clientId = pathSegments[pathSegments.length - 3];  // Corrigido para pegar o clientId corretamente

    const handleSubmit = async (data: any) => {
        if (!clientId) {
            console.error("Client ID não encontrado na URL.");
            return;
        }

        let endpoint = '';
        switch (data.produto) {
            case 'plano_saude':
                endpoint = '/apolices/planos-saude/';
                break;
            case 'seguro_vida':
                endpoint = '/apolices/seguros-vida/';
                break;
            // Adicione outros endpoints conforme necessário
            default:
                console.error("Produto inválido.");
                return;
        }

        await dispatch(createApolice({ clientId, data, endpoint }));
        router.push(`/dashboard/cliente/${clientId}/apolice`); // Redireciona após a criação
    };

    return (
        <div>
            <h1>Criar Nova Apólice</h1>
            <ApoliceForm onSubmit={handleSubmit} />
        </div>
    );
};

export default NovaApolicePage;
