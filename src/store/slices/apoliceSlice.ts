import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Apolice } from '@/types/interfaces';
import api from "@/app/api/axios";

// 📌 Estado inicial
interface ApolicesState {
    apolices: Apolice[];
    apoliceDetalhe: Apolice | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isModalOpen: boolean;
}

const initialState: ApolicesState = {
    apolices: [],
    apoliceDetalhe: null,
    status: 'idle',
    error: null,
    isModalOpen: false,
};

// 📌 Buscar todas as apólices com filtros
export const fetchApolices = createAsyncThunk<Apolice[], { tipo?: string; status?: string; cliente?: string }>(
    'apolices/fetchApolices',
    async ({ tipo, status, cliente }, { rejectWithValue }) => {
        try {
            const response = await api.get('/apolices/', {
                params: { tipo, status, cliente }
            });
            console.log(response);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar apólices.');
        }
    }
);

// 📌 Buscar detalhes de uma apólice específica
export const fetchApoliceDetalhe = createAsyncThunk<Apolice, { produto: string; apoliceId: string }>(
    'apolices/fetchApoliceDetalhe',
    async ({ produto, apoliceId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/apolices/${produto}/${apoliceId}/`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar detalhes da apólice.');
        }
    }
);

// 📌 Criar uma nova apólice
export const createApolice = createAsyncThunk<Apolice, { formData: FormData }>(
    'apolices/createApolice',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const response = await api.post('/apolices/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao criar apólice.');
        }
    }
);

// 📌 Atualizar uma apólice
export const updateApolice = createAsyncThunk<
    Apolice,
    { apoliceId: string; formData: FormData; clientId?: string; endpoint?: string; produto?: string }
>(
    'apolices/updateApolice',
    async ({ apoliceId, formData, clientId, endpoint, produto }, { rejectWithValue }) => {
        try {
            const url = endpoint ? endpoint : `/apolices/${produto}/${apoliceId}/`;
            const response = await api.patch(url, formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao atualizar apólice.');
        }
    }
);


// 📌 Deletar uma apólice
export const deleteApolice = createAsyncThunk<string, { apoliceId: string }>(
    'apolices/deleteApolice',
    async ({ apoliceId }, { rejectWithValue }) => {
        try {
            await api.delete(`/apolices/${apoliceId}/`);
            return apoliceId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao deletar apólice.');
        }
    }
);

// 📌 Slice principal
const apolicesSlice = createSlice({
    name: 'apolices',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        },
        clearApolices: (state) => {
            state.apolices = [];
            state.apoliceDetalhe = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 📌 Buscar Apólices
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

            // 📌 Buscar Detalhe
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
            })

            // 📌 Criar Apólice
            .addCase(createApolice.fulfilled, (state, action) => {
                state.apolices.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createApolice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // 📌 Atualizar Apólice
            .addCase(updateApolice.fulfilled, (state, action) => {
                const index = state.apolices.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.apolices[index] = action.payload;
                }
                state.status = 'succeeded';
            })
            .addCase(updateApolice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // 📌 Deletar Apólice
            .addCase(deleteApolice.fulfilled, (state, action) => {
                state.apolices = state.apolices.filter(a => a.id !== action.payload);
                state.status = 'succeeded';
            })
            .addCase(deleteApolice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// 📌 Ações
export const { openModal, closeModal, clearApolices } = apolicesSlice.actions;

// 📌 Selectors
export const selectApolices = (state: RootState) => state.apolices.apolices;
export const selectApoliceDetalhe = (state: RootState) => state.apolices.apoliceDetalhe;
export const selectApolicesStatus = (state: RootState) => state.apolices.status;
export const selectApolicesError = (state: RootState) => state.apolices.error;
export const selectIsModalOpen = (state: RootState) => state.apolices.isModalOpen;

// 📌 Exportando Reducer
export default apolicesSlice.reducer;
