import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { NegociacaoCliente } from '@/types/interfaces';

interface NegociacoesState {
    negociacoes: NegociacaoCliente[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NegociacoesState = {
    negociacoes: [],
    status: 'idle',
    error: null,
};

// Buscar negociações por cliente
const fetchNegociacoes = createAsyncThunk<NegociacaoCliente[], string>(
    'negociacoes/fetchNegociacoes',
    async (clienteId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/negociacoes/?cliente_id=${clienteId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar negociações');
        }
    }
);

// Criar nova negociação
const createNegociacao = createAsyncThunk<NegociacaoCliente, Partial<NegociacaoCliente>>(
    'negociacoes/createNegociacao',
    async (novaNegociacao, { rejectWithValue }) => {
        try {
            const response = await api.post('/negociacoes/', novaNegociacao);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao criar negociação');
        }
    }
);

// Atualizar negociação (ex: trocar de etapa)
const updateNegotiation = createAsyncThunk<
    NegociacaoCliente,
    { id: string; data: Partial<NegociacaoCliente> }
>(
    'negociacoes/updateNegotiation',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/negociacoes/${id}/`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao atualizar negociação');
        }
    }
);

// Encerrar negociação com motivo
const closeNegotiation = createAsyncThunk<
    NegociacaoCliente,
    { id: string; data: Partial<NegociacaoCliente> }
>(
    'negociacoes/closeNegotiation',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/negociacoes/${id}/`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao encerrar negociação');
        }
    }
);


// Deletar negociação
const deleteNegotiation = createAsyncThunk<string, string>(
    'negociacoes/deleteNegotiation',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/negociacoes/${id}/`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao deletar negociação');
        }
    }
);

// Slice
const negociacoesSlice = createSlice({
    name: 'negociacoes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNegociacoes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNegociacoes.fulfilled, (state, action: PayloadAction<NegociacaoCliente[]>) => {
                state.status = 'succeeded';
                state.negociacoes = action.payload;
            })
            .addCase(fetchNegociacoes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createNegociacao.fulfilled, (state, action: PayloadAction<NegociacaoCliente>) => {
                state.negociacoes.push(action.payload);
            })
            .addCase(updateNegotiation.fulfilled, (state, action: PayloadAction<NegociacaoCliente>) => {
                const index = state.negociacoes.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.negociacoes[index] = action.payload;
                }
            })
            .addCase(closeNegotiation.fulfilled, (state, action: PayloadAction<NegociacaoCliente>) => {
                const index = state.negociacoes.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.negociacoes[index] = action.payload;
                }
            })
            .addCase(deleteNegotiation.fulfilled, (state, action: PayloadAction<string>) => {
                state.negociacoes = state.negociacoes.filter(n => n.id !== action.payload);
            });
    },
});

// Exportações nomeadas
export {
    fetchNegociacoes as fetchNegotiationsByLead,
    createNegociacao as createNegotiation,
    updateNegotiation,
    closeNegotiation,
    deleteNegotiation,
};

export default negociacoesSlice.reducer;
