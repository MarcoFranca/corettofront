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
    async ({ status }, { rejectWithValue }) => {
        try {

            let statusQuery = '';
            if (Array.isArray(status) && status.length > 0) {
                statusQuery = `status__in=${status.map(encodeURIComponent).join(',')}`;
            }

            const response = await api.get(`/clientes/?${statusQuery}`);
            // Garantir que a resposta tem um array de leads
            if (!response.data || typeof response.data !== 'object' || !Array.isArray(response.data.results)) {
                console.warn("⚠️ Formato inesperado da resposta:", response.data);
                return rejectWithValue("Formato de resposta inválido");
            }

            return response.data.results; // Retorna os leads corretamente
        } catch (error: any) {
            console.error("❌ Erro ao buscar leads:", error);
            return rejectWithValue(error.response?.data || "Erro desconhecido ao buscar leads");
        }
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
