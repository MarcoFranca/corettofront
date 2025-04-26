'use client'
import { Modal, message } from 'antd'
import { useEffect } from 'react'
import api from '@/app/api/axios'

export const ModalTrocaPlano = ({ planoId, onClose }: { planoId: string, onClose: () => void }) => {
    useEffect(() => {
        Modal.confirm({
            title: 'Deseja realmente trocar de plano?',
            content: 'A alteração será imediata e sua cobrança será ajustada proporcionalmente no Stripe.',
            okText: 'Confirmar Troca',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await api.post('/pagamentos/trocar-plano/', { plano_id: planoId });
                    message.success('Plano alterado com sucesso!');
                    onClose();
                } catch {
                    message.error('Erro ao trocar o plano');
                }
            },
            onCancel: () => {
                onClose();
            }
        });
    }, [planoId]);

    return null; // Não renderiza nada diretamente
};
