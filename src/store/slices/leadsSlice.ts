import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';

interface Lead {
    id?: string;
    nome: string;
    contato: string;
    telefone: string;
    email: string;
    endereco: string;
    status: string;
    pipeline_stage?: string; // Novo campo
}

interface LeadsState {
    leads: Lead[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LeadsState = {
    leads: [],
    status: 'idle',
    error: null,
};

// Fetch Leads
export const fetchLeads = createAsyncThunk<Lead[]>('leads/fetchLeads', async () => {
    const response = await api.get('/clientes/');
    return response.data;
});

// Create Lead
export const createLead = createAsyncThunk<Lead, Lead>('leads/createLead', async (novoLead) => {
    const response = await api.post('/clientes/', novoLead);
    return response.data;
});

// Update Lead
export const updateLead = createAsyncThunk<Lead, { id: string; updatedLead: Lead }>('leads/updateLead', async ({ id, updatedLead }) => {
    const response = await api.put(`/clientes/${id}/`, updatedLead);
    return response.data;
});

// Update Lead Status (Novo campo pipeline_stage)
export const updateLeadStatus = createAsyncThunk<Lead, { id: string; status: string }>('leads/updateLeadStatus', async ({ id, status }) => {
    const response = await api.patch(`/clientes/${id}/`, { pipeline_stage: status });
    return response.data;
});

// Delete Lead
export const deleteLead = createAsyncThunk<string, string>('leads/deleteLead', async (id) => {
    await api.delete(`/clientes/${id}/`);
    return id;
});

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeads.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.leads = action.payload;
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createLead.fulfilled, (state, action) => {
                state.leads.push(action.payload);
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                const index = state.leads.findIndex(lead => lead.id === action.payload.id);
                state.leads[index] = action.payload;
            })
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                const index = state.leads.findIndex(lead => lead.id === action.payload.id);
                if (index !== -1) {
                    state.leads[index].pipeline_stage = action.payload.pipeline_stage;
                }
            })
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.leads = state.leads.filter(lead => lead.id !== action.payload);
            });
    },
});

export default leadsSlice.reducer;