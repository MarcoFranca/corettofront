import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Apolices, Apolice } from '@/types/interfaces';
import api from "@/app/api/axios";

interface ApolicesState {
    apolices: Apolices;
    apoliceDetalhe: Apolice | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isModalOpen: boolean;  // Novo estado para controlar o modal
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
    isModalOpen: false,  // Inicialmente o modal está fechado
};

export const fetchApolices = createAsyncThunk<Apolices, { clientId: string }, { rejectValue: string }>(
    'apolices/fetchApolices',
    async ({ clientId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/clientes/${clientId}/`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar apólices.');
        }
    }
);

export const fetchApoliceDetalhe = createAsyncThunk<Apolice, { produto: string, apoliceId: string }, { rejectValue: string }>(
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

export const createApolice = createAsyncThunk<Apolice, { formData: FormData; endpoint: string; clientId: string }, { rejectValue: string }>(
    'apolices/createApolice',
    async ({ formData, endpoint, clientId }, { rejectWithValue, dispatch, getState }) => {
        try {
            // Criação da apólice
            formData.append('cliente', clientId);
            formData.append('status_proposta', 'true');
            const response = await api.post(endpoint, formData, );

            // Pegando o estado global para obter as informações do cliente
            const state = getState() as RootState;
            const clienteDetalhe = state.clientes.clienteDetalhe;

            // Verificando se todas as informações necessárias estão disponíveis
            if (!clienteDetalhe) {
                throw new Error('Detalhes do cliente não encontrados.');
            }

            const clienteData = {
                status: 'ativo',
                nome: clienteDetalhe.nome,
                telefone: clienteDetalhe.telefone,
                email: clienteDetalhe.email,
                cpf: clienteDetalhe.cpf,
                data_nascimento: clienteDetalhe.data_nascimento,
                genero: clienteDetalhe.genero,
                profissao: clienteDetalhe.profissao,
            };

            // Enviando todos os dados necessários via PATCH para atualizar o status
            const patchResponse = await api.patch(`/clientes/${clientId}/`, clienteData);

            console.log('Resposta do PATCH:', patchResponse.data);

            return response.data;  // Retorna a apólice criada
        } catch (error: any) {
            console.error('Erro ao criar apólice ou atualizar cliente:', error.response?.data);
            // console.error('Erro ao criar apólice ou atualizar cliente:', error);
            // Disparar a ação para abrir o modal se houver erro de campos obrigatórios
            if (error.response?.data?.cpf || error.response?.data?.telefone || error.response?.data?.email) {
                dispatch(openModal());
            }
            return rejectWithValue(error.response?.data || 'Erro ao criar apólice.');
        }
    }
);

export const deleteApolice = createAsyncThunk<
    { apoliceId: string, produto: string }, // O que retornamos
    { clientId: string, apoliceId: string, produto: string }, // Parâmetros
    { rejectValue: string }
>(
    'apolices/deleteApolice',
    async ({ clientId, apoliceId, produto }, { rejectWithValue }) => {
        try {
            await api.delete(`/apolices/${produto}/${apoliceId}/`);
            return { apoliceId, produto };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao deletar apólice.');
        }
    }
);

export const updateApolice = createAsyncThunk<
    Apolice, // O que retornamos
    { formData: FormData; endpoint: string; clientId: string; apoliceId: string; produto: string }, // Parâmetros
    { rejectValue: string }
>(
    'apolices/updateApolice',
    async ({ formData, endpoint, clientId, apoliceId, produto }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${endpoint}${apoliceId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data; // Retorna a apólice atualizada
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Erro ao atualizar apólice.');
        }
    }
);
// Continue com a configuração normal do slice



const apolicesSlice = createSlice({
    name: 'apolices',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;  // Abre o modal
        },
        closeModal: (state) => {
            state.isModalOpen = false; // Fecha o modal
        },
    },
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
            })
            .addCase(createApolice.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createApolice.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const produto = action.payload.produto;

                // Verificação se o array do produto existe, caso contrário, inicializa-o
                if (!state.apolices[produto]) {
                    state.apolices[produto] = [];
                }

                state.apolices[produto].push(action.payload);
            })
            .addCase(createApolice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateApolice.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateApolice.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const produto = action.payload.produto;

                // Encontrar e atualizar a apólice no estado
                const index = state.apolices[produto]?.findIndex(apolice => apolice.id === action.payload.id);
                if (index !== undefined && index !== -1) {
                    state.apolices[produto][index] = action.payload;
                }
            })
            .addCase(updateApolice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteApolice.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteApolice.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const produto = action.payload.produto;

                // Remover a apólice deletada do estado
                state.apolices[produto] = state.apolices[produto].filter(
                    apolice => apolice.id !== action.payload.apoliceId
                );
            })
            .addCase(deleteApolice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Exportar as ações
export const { openModal, closeModal } = apolicesSlice.actions;

export default apolicesSlice.reducer;

// Selectors
export const getApoliceDetalhe = (state: RootState) => state.apolices?.apoliceDetalhe || null;
export const getApolicesStatus = (state: RootState) => state.apolices?.status || 'idle';
export const getApolicesError = (state: RootState) => state.apolices?.error || null;
export const getIsModalOpen = (state: RootState) => state.apolices?.isModalOpen || false;
