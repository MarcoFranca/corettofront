// NovaTarefaNegociacaoModal.tsx
'use client';

import React from 'react';
import TodoDrawer from '@/app/(pages)/dashboard/(painel_admin)/tarefas/TodoDrawer';

interface Props {
    visible: boolean;
    negociacao: any;
    cliente: any;
    onClose: () => void;
    onCreated: (tarefa: any) => void;
}

const NovaTarefaNegociacaoModal: React.FC<Props> = ({ visible, negociacao, cliente, onClose }) => {
    return (
        <TodoDrawer
            open={visible}
            onClose={onClose}
            modoEdicao={false}
            tarefa={{
                title: `Tarefa relacionada à negociação: ${negociacao.titulo}`,
                cliente: { value: cliente.id, label: `${cliente.nome} ${cliente.sobre_nome}` },
                negociacao: negociacao.id,
            }}
        />
    );
};

export default NovaTarefaNegociacaoModal;
