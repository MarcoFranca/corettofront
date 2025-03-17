import { DropResult } from '@hello-pangea/dnd';
import { Dispatch } from '@reduxjs/toolkit';
import { updateLeadStatus } from '@/store/slices/leadsSlice';
import { Data, Lead } from "@/types/interfaces";

export const initializeData = (leadsFromStore: any[] = []): Data => {

    const leads: { [key: string]: Lead } = {};
    const columns: { [key: string]: { id: string, title: string, leadIds: string[] } } = {
        'column-1': { id: 'column-1', title: 'LEADS DE ENTRADA', leadIds: [] },
        'column-2': { id: 'column-2', title: 'NEGOCIANDO', leadIds: [] },
        'column-3': { id: 'column-3', title: 'FINALIZAÇÃO', leadIds: [] },
        'column-4': { id: 'column-4', title: 'POUCO INTERESSE', leadIds: [] },
        'column-5': { id: 'column-5', title: 'CLIENTES ATIVOS ✅', leadIds: [] }, // ✅ Nova coluna para clientes ativos
        'column-6': { id: 'column-6', title: 'CLIENTES PERDIDOS ❌', leadIds: [] }, // ✅ Nova coluna para recusados
    };

    if (!leadsFromStore || leadsFromStore.length === 0) {
        return { leads, columns, columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'] };
    }

    leadsFromStore.forEach((lead) => {
        if (!lead.id) {
            console.error("⚠️ Lead sem ID encontrado:", lead);
            return;
        }

        leads[lead.id.toString()] = {
            id: lead.id.toString(),
            status: lead.status || '',
            nome: lead.nome || '',
            sobre_nome: lead.sobre_nome || '',
            email: lead.email || '',
            telefone: lead.telefone || '',
            endereco: lead.endereco || '',
            contato: lead.contato || '',
            pipeline_stage: lead.pipeline_stage || 'LEADS DE ENTRADA', // 🚀 Fallback para pipeline_stage
            status_reuniao: lead.status_reuniao || '',
            created_at: lead.created_at || '',
            updated_at: lead.updated_at || '',
            indicado_por_detalhes: lead.indicado_por_detalhes || null,
            oportunidades: lead.relacionamentos?.oportunidades || [],
            parceiros: lead.relacionamentos?.parceiros || [],
            observacoes: lead.observacoes || '', // ✅ Agora `observacoes` é preservado!
        };

        // 🚀 Verifica o `pipeline_stage` e categoriza corretamente
        const pipelineStage = (lead.pipeline_stage || '').toLowerCase().trim();

        if (pipelineStage.includes('entrada')) {
            columns['column-1'].leadIds.push(lead.id.toString());
        } else if (pipelineStage.includes('negociacao') || pipelineStage.includes('negociando')) {
            columns['column-2'].leadIds.push(lead.id.toString());
        } else if (pipelineStage.includes('finaliza')) {
            columns['column-3'].leadIds.push(lead.id.toString());
        } else if (pipelineStage.includes('pouco interesse')) {
            columns['column-4'].leadIds.push(lead.id.toString());
        } else if (pipelineStage.includes('ativo')) {
            columns['column-5'].leadIds.push(lead.id.toString()); // ✅ Clientes Ativos
        } else if (pipelineStage.includes('recusado')) {
            columns['column-6'].leadIds.push(lead.id.toString()); // ✅ Clientes Perdidos
        } else {
            console.warn(`⚠️ Lead ID ${lead.id} sem pipeline_stage categorizado corretamente:`, lead.pipeline_stage);
        }
    });

    return {
        leads,
        columns,
        columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'],
    };
};

export const handleDragEnd = (
    result: DropResult,
    data: Data,
    setData: React.Dispatch<React.SetStateAction<Data>>,
    leadsFromStore: any[],
    dispatch: Dispatch<any>
) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
        console.warn("⚠️ Nenhum destino definido para o evento de drag.");
        return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (!start || !finish) {
        console.error("❌ Coluna de origem ou destino não encontrada.");
        return;
    }

    if (start === finish) {
        // ✅ Movendo dentro da mesma coluna → Apenas reordena os IDs
        const newLeadIds = Array.from(start.leadIds);
        newLeadIds.splice(source.index, 1);
        newLeadIds.splice(destination.index, 0, draggableId);

        const newColumn = { ...start, leadIds: newLeadIds };

        const newState = { ...data, columns: { ...data.columns, [newColumn.id]: newColumn } };

        setData(newState);
        return;
    }

    // ✅ Removendo da coluna inicial
    const startLeadIds = Array.from(start.leadIds);
    startLeadIds.splice(source.index, 1);
    const newStart = { ...start, leadIds: startLeadIds };

    // ✅ Adicionando na coluna de destino
    const finishLeadIds = Array.from(finish.leadIds);
    finishLeadIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, leadIds: finishLeadIds };

    const newState = {
        ...data,
        columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    };

    setData(newState);

    // 🚀 Atualizando o backend
    const updatedLead = leadsFromStore.find((lead) => lead.id?.toString() === draggableId);
    if (!updatedLead) {
        console.error(`❌ Lead com ID ${draggableId} não encontrado.`);
        return;
    }

    // ✅ Define o novo `pipeline_stage`
    let newPipelineStage = newFinish.title.toLowerCase().replace(/[^\w\s]/gi, '').trim();
    let newStatus = updatedLead.status; // Mantém o status original como padrão

    // ✅ Se foi movido para "Clientes Ativos", o status muda para "ativo"
    if (finish.id === "column-5") {
        newStatus = "ativo";
    }

    // ✅ Se foi movido para "Clientes Perdidos", o status muda para "recusado"
    if (finish.id === "column-6") {
        newStatus = "recusado";
    }

    // 🔥 Atualiza apenas se o status ou pipeline_stage mudar
    if (newStatus !== updatedLead.status || newPipelineStage !== updatedLead.pipeline_stage) {
        console.log(`🚀 Atualizando lead ID ${draggableId}: pipeline_stage=${newPipelineStage}, status=${newStatus}`);

        try {
            dispatch(updateLeadStatus({ id: draggableId, status: newStatus, pipeline_stage: newPipelineStage }));

            // ✅ Remove manualmente da lista ao confirmar sucesso
            setData((prevData) => {
                const updatedColumns = { ...prevData.columns };
                updatedColumns[start.id].leadIds = updatedColumns[start.id].leadIds.filter(id => id !== draggableId);
                return { ...prevData, columns: updatedColumns };
            });
        } catch (error) {
            console.error("❌ Erro ao atualizar lead:", error);
        }
    }
};
