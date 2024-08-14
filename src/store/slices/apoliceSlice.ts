// store/slices/apolicesSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';

interface Apolice {
    id: string;
    cliente: string;
    // Outros campos de apólice genéricos
}

interface ApolicesState {
    apolices: Apolice[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ApolicesState = {
    apolices: [],
    status: 'idle',
    error: null,
};

// Async thunk para buscar as apólices de um cliente para o tipo de produto específico
export const fetchApolices = createAsyncThunk<Apolice[], { clientId: string, endpoint: string }>(
    'apolices/fetchApolices',
    async ({ clientId, endpoint }, { rejectWithValue }) => {
        try {
            const response = await api.get(endpoint, {
                params: { cliente: clientId },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar apólices');
        }
    }
);

// Async thunk para criar uma nova apólice
export const createApolice = createAsyncThunk<Apolice, { clientId: string; data: any; endpoint: string }>(
    'apolices/createApolice',
    async ({ clientId, data, endpoint }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            const response = await api.post(`${endpoint}?cliente=${clientId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao criar apólice');
        }
    }
);

// Slice de apólices
const apolicesSlice = createSlice({
    name: 'apolices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApolices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchApolices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.apolices = action.payload;
            })
            .addCase(fetchApolices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createApolice.fulfilled, (state, action) => {
                state.apolices.push(action.payload);
            });
    },
});

export default apolicesSlice.reducer;
