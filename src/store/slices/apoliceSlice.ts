import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Apolices, Apolice } from '@/types/interfaces';
import api from "@/app/api/axios";

interface ApolicesState {
    apolices: Apolices;
    apoliceDetalhe: Apolice | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ApolicesState = {
    apolices: {
        plano_saude: [],
        seguro_vida: [],
        previdencia: [],
        consorcio: [],
        investimento: [],
        seguro_profissional: [],
        seguro_residencial: [],
    },
    apoliceDetalhe: null,
    status: 'idle',
    error: null,
};

// Thunk para buscar todas as apólices de um cliente
export const fetchApolices = createAsyncThunk<Apolices, { clientId: string }, { rejectValue: string }>(
    'apolices/fetchApolices',
    async ({ clientId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/clientes/${clientId}/`);
            return response.data.apolices;
        } catch (error: any) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para buscar os detalhes de uma apólice específica
export const fetchApoliceDetalhe = createAsyncThunk<any, { produto: string, apoliceId: string }, { rejectValue: string }>(
    'apolices/fetchApoliceDetalhe',
    async ({ produto, apoliceId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/apolices/${produto}/${apoliceId}/`);
            return response.data;
        } catch (error: any) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

const apolicesSlice = createSlice({
    name: 'apolices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApolices.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchApolices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.apolices = action.payload;
            })
            .addCase(fetchApolices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchApoliceDetalhe.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchApoliceDetalhe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.apoliceDetalhe = action.payload;
            })
            .addCase(fetchApoliceDetalhe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default apolicesSlice.reducer;



// Selectors
export const selectAllApolices = (state: RootState) => state.apolices.apolices;
export const getApolicesStatus = (state: RootState) => state.apolices.status;
export const getApolicesError = (state: RootState) => state.apolices.error;
export const getApoliceDetalhe = (state: RootState) => state.apolices.apoliceDetalhe;
