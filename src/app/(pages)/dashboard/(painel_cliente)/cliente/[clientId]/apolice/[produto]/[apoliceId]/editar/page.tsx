'use client'
import React from 'react';
import EditApoliceForm from '@/app/components/apolices/EditApoliceForm';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/hooks';
import { updateApolice } from '@/store/slices/apoliceSlice';

const EditApolicePage: React.FC = () => {
    const params = useParams();
    const dispatch = useAppDispatch();

    // Extraindo os parâmetros da URL
    const clientId = Array.isArray(params.clientId) ? params.clientId[0] : params.clientId;
    const apoliceId = Array.isArray(params.apoliceId) ? params.apoliceId[0] : params.apoliceId;
    const produto = Array.isArray(params.produto) ? params.produto[0] : params.produto;

    const handleUpdateApolice = (data: any, endpoint: string) => {
        // Criando um objeto FormData para enviar os dados
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        dispatch(updateApolice({ formData, endpoint, clientId, apoliceId, produto }))
            .then(() => {
                // Redirecionar para a página de detalhes ou lista após a atualização bem-sucedida
                window.location.href = `/dashboard/cliente/${clientId}/apolice`;
            });
    };

    return (
        <EditApoliceForm
            apoliceId={apoliceId}
            produto={produto}
            onSubmit={handleUpdateApolice}
            clientId={clientId}
        />
    );
};

export default EditApolicePage;
