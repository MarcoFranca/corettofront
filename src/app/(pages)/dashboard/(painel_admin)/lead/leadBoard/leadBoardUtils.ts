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
    };

    if (!leadsFromStore || leadsFromStore.length === 0) {
        return { leads, columns, columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'] };
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
        } else {
            console.warn(`⚠️ Lead ID ${lead.id} sem pipeline_stage categorizado corretamente:`, lead.pipeline_stage);
        }
    });

    return {
        leads,
        columns,
        columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
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
        console.warn("No destination for the drag event.");
        return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (!start) {
        console.error(`Column with ID ${source.droppableId} not found.`);
        return;
    }

    if (!finish) {
        console.error(`Column with ID ${destination.droppableId} not found.`);
        return;
    }


    if (start === finish) {
        const newLeadIds = Array.from(start.leadIds);
        newLeadIds.splice(source.index, 1);
        newLeadIds.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...start,
            leadIds: newLeadIds,
        };

        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newColumn.id]: newColumn,
            },
        };

        setData(newState);
        return;
    }

    const startLeadIds = Array.from(start.leadIds);
    startLeadIds.splice(source.index, 1);
    const newStart = {
        ...start,
        leadIds: startLeadIds,
    };

    const finishLeadIds = Array.from(finish.leadIds);
    finishLeadIds.splice(destination.index, 0, draggableId);
    const newFinish = {
        ...finish,
        leadIds: finishLeadIds,
    };

    const newState = {
        ...data,
        columns: {
            ...data.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        },
    };

    setData(newState);

    const updatedLead = leadsFromStore.find((lead) => lead.id?.toString() === draggableId);
    if (!updatedLead) {
        console.error(`Lead with ID ${draggableId} not found in leadsFromStore.`);
        return;
    }

    const newStatus = newFinish.title.toLowerCase();
    console.log(`Updating lead ID ${draggableId} to pipeline_stage ${newStatus}`);
    dispatch(updateLeadStatus({ id: draggableId, status: newStatus }));

};
