import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Lead, LeadsState } from '@/types/interfaces';
import api from '@/app/api/axios';

const initialState: LeadsState = {
    leads: [],
    status: 'idle',
    error: null,
};

export const fetchLeads = createAsyncThunk<Lead[], { status?: string[] }>(
    'leads/fetchLeads',
    async ({ status }) => {
        console.log('Fetching leads with statuses:', status);

        let statusQuery = '';

        // Verifica se `status` é um array e gera a query correta
        if (Array.isArray(status) && status.length > 0) {
            statusQuery = `status__in=${status.map(encodeURIComponent).join(',')}`;
        }

        const response = await api.get(`/clientes/?${statusQuery}`);
        console.log('Response from fetchLeads:', response.data);
        return response.data;
    }
);




export const createLead = createAsyncThunk<Lead, Partial<Lead>>(
    'leads/createLead',
    async (novoLead) => {
        const response = await api.post('/clientes/', novoLead);
        return response.data;
    }
);

export const updateLead = createAsyncThunk<Lead, { id: string; updatedLead: Partial<Lead> }>('leads/updateLead', async ({ id, updatedLead }) => {
    const response = await api.patch(`/clientes/${id}/`, updatedLead);
    return response.data;
});

// Adicionando de volta a função updateLeadStatus
export const updateLeadStatus = createAsyncThunk<Lead, { id: string; status: string }>('leads/updateLeadStatus', async ({ id, status }) => {
    const response = await api.patch(`/clientes/${id}/`, { pipeline_stage: status });
    return response.data;
});

export const deleteLead = createAsyncThunk<string, string>('leads/deleteLead', async (id) => {
    await api.delete(`/clientes/${id}/`);
    return id;
});

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        resetLeads: (state) => {
            state.leads = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeads.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.leads = action.payload || []; // Garantir array vazio como fallback
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Erro ao buscar leads';
                console.error('Erro ao buscar leads:', action.error.message);
            })
            .addCase(createLead.fulfilled, (state, action) => {
                state.leads.push(action.payload);
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                const index = state.leads.findIndex(lead => lead.id === action.payload.id);
                if (index !== -1) {
                    state.leads[index] = action.payload;
                } else {
                    console.warn(`Lead ID ${action.payload.id} não encontrado para atualização.`);
                }
            })
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                const index = state.leads.findIndex(lead => lead.id === action.payload.id);
                if (index !== -1) {
                    state.leads[index].pipeline_stage = action.payload.pipeline_stage;
                }
            })
            .addCase(deleteLead.fulfilled, (state, action) => {
                const filteredLeads = state.leads.filter(lead => lead.id !== action.payload);
                if (filteredLeads.length === state.leads.length) {
                    console.warn(`Lead ID ${action.payload} não encontrado para exclusão.`);
                }
                state.leads = filteredLeads;
            });
    },
});

export const { resetLeads } = leadsSlice.actions;
export default leadsSlice.reducer;
