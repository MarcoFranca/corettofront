import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';

interface Lead {
    id?: number;
    nome: string;
    contato: string;
    telefone: string;
    email: string;
    endereco: string;
    status: string;
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
export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
    const response = await api.get('/clientes/');
    return response.data;
});

// Create Lead
export const createLead = createAsyncThunk('leads/createLead', async (novoLead: Lead) => {
    const response = await api.post('/clientes/', novoLead);
    return response.data;
});

// Update Lead
export const updateLead = createAsyncThunk('leads/updateLead', async ({ id, updatedLead }: { id: number; updatedLead: Lead }) => {
    const response = await api.put(`/clientes/${id}/`, updatedLead);
    return response.data;
});

// Delete Lead
export const deleteLead = createAsyncThunk('leads/deleteLead', async (id: number) => {
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
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.leads = state.leads.filter(lead => lead.id !== action.payload);
            });
    },
});

export default leadsSlice.reducer;
