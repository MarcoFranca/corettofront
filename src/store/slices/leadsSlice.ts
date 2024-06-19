// src/store/slices/fornecedorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/app/utils/auth';

interface Leads {
    id?: number;
    nome: string;
    contato: string;
    telefone: string;
    email: string;
    endereco: string;
}

interface LeadsState {
    leads: Leads[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LeadsState = {
    leads: [],
    status: 'idle',
    error: null,
};

export const fetchLeads = createAsyncThunk('fornecedores/fetchFornecedores', async () => {
    const response = await axiosInstance.get('/api/v1/suppliers/suppliers/');
    return response.data;
});

export const createLeads = createAsyncThunk('fornecedores/createFornecedor', async (novoLead: Leads) => {
    const response = await axiosInstance.post('/api/v1/leads/leads/', novoLead, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });
    return response.data;
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
            .addCase(createLeads.fulfilled, (state, action) => {
                state.leads.push(action.payload);
            });
    },
});

export default leadsSlice.reducer;
