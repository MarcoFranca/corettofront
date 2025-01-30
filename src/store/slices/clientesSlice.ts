import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Cliente, ClientesState } from '@/types/interfaces';

const initialState: ClientesState = {
    clientes: [],
    clienteDetalhe: null, // Inicialize clienteDetalhe como null
    status: 'idle',
    statusDetalhe: 'idle', // Adicione statusDetalhe ao estado inicial
    error: null,
    errorDetalhe: null, // Adicione errorDetalhe ao estado inicial
};

export const fetchClientes = createAsyncThunk<Cliente[], { status?: string, search?: string } | undefined>(
    'clientes/fetchClientes',
    async (params) => {
        const response = await api.get('/clientes/', { params });
        return response.data;
    }
);

export const fetchClienteDetalhe = createAsyncThunk<Cliente, string>(
    'clientes/fetchClienteDetalhe',
    async (id) => {
        const response = await api.get(`/clientes/${id}/`);
        return response.data;
    }
);

export const updateClienteToActive = createAsyncThunk<Cliente, { id: string; updatedCliente: Partial<Cliente> }>(
    'clientes/updateClienteToActive',
    async ({ id, updatedCliente }, { dispatch }) => {
        // Atualizando o status do cliente para 'ativo' junto com os dados atualizados
        const response = await api.patch(`/clientes/${id}/`, { ...updatedCliente, status: 'ativo' });
        dispatch(fetchClientes());
        return response.data;
    }
);

export const updateClienteStatus = createAsyncThunk<
    Cliente,
    { id: string; status: string }
>(
    'clientes/updateClienteStatus',
    async ({ id, status }, { dispatch }) => {
        const response = await api.patch(`/clientes/${id}/`, { status });
        dispatch(fetchClienteDetalhe(id)); // Atualiza os detalhes do cliente após a alteração
        return response.data;
    }
);


export const createCliente = createAsyncThunk<Cliente, Cliente>('clientes/createCliente', async (novoCliente, { dispatch }) => {
    const response = await api.post('/clientes/', novoCliente);
    dispatch(fetchClientes());
    return response.data;
});

export const updateCliente = createAsyncThunk<Cliente, { id: string; updatedCliente: Partial<Cliente> }>(
    'clientes/updateCliente',
    async ({ id, updatedCliente }, { dispatch }) => {
        const response = await api.patch(`/clientes/${id}/`, updatedCliente);
        dispatch(fetchClientes());
        return response.data;
    }
);

export const updateClienteSaude = createAsyncThunk<Cliente, { id: string; saudeData: Partial<Cliente['saude']> }>(
    'clientes/updateClienteSaude',
    async ({ id, saudeData }, { dispatch }) => {
        const response = await api.patch(`/clientes/${id}/`, { saude: saudeData });
        dispatch(fetchClienteDetalhe(id));
        return response.data;
    }
);

export const deleteCliente = createAsyncThunk<string, string>('clientes/deleteCliente', async (id, { dispatch }) => {
    await api.delete(`/clientes/${id}/`);
    dispatch(fetchClientes());
    return id;
});

export const updateClienteObservacao = createAsyncThunk<Cliente, { id: string; observacoes: string }>(
    'clientes/updateClienteObservacao',
    async ({ id, observacoes }, { dispatch }) => {
        const response = await api.patch(`/clientes/${id}/`, { observacoes });
        dispatch(fetchClienteDetalhe(id)); // Atualize os detalhes do cliente após a atualização
        return response.data;
    }
);

const clientesSlice = createSlice({
    name: 'clientes',
    initialState,
    reducers: {
        resetClientes: (state) => {
            state.clientes = [];
            state.clienteDetalhe = null;
            state.status = 'idle';
            state.statusDetalhe = 'idle';
            state.error = null;
            state.errorDetalhe = null;
        },
    },


    extraReducers: (builder) => {
        builder
            .addCase(fetchClientes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchClientes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.clientes = action.payload;
            })
            .addCase(fetchClientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchClienteDetalhe.pending, (state) => {
                state.statusDetalhe = 'loading';
            })
            .addCase(fetchClienteDetalhe.fulfilled, (state, action) => {
                state.statusDetalhe = 'succeeded';
                state.clienteDetalhe = action.payload;
            })
            .addCase(fetchClienteDetalhe.rejected, (state, action) => {
                state.statusDetalhe = 'failed';
                state.errorDetalhe = action.error.message || null;
            })
            .addCase(createCliente.fulfilled, (state, action) => {
                state.clientes.push(action.payload);
            })
            .addCase(updateCliente.fulfilled, (state, action) => {
                const index = state.clientes.findIndex(cliente => cliente.id === action.payload.id);
                if (index !== -1) {
                    state.clientes[index] = action.payload;
                }
                if (state.clienteDetalhe && state.clienteDetalhe.id === action.payload.id) {
                    state.clienteDetalhe = action.payload;
                }
            })
            .addCase(updateClienteSaude.fulfilled, (state, action) => {
                if (state.clienteDetalhe && state.clienteDetalhe.id === action.payload.id) {
                    state.clienteDetalhe.saude = action.payload.saude;
                }
            })
            .addCase(updateClienteObservacao.fulfilled, (state, action) => {
                const index = state.clientes.findIndex(cliente => cliente.id === action.payload.id);
                if (index !== -1) {
                    state.clientes[index] = action.payload;
                }
                if (state.clienteDetalhe && state.clienteDetalhe.id === action.payload.id) {
                    state.clienteDetalhe = action.payload;
                }
            })
            .addCase(deleteCliente.fulfilled, (state, action) => {
                state.clientes = state.clientes.filter(cliente => cliente.id !== action.payload);
            })
            // Adicionando o case para updateClienteToActive
            .addCase(updateClienteToActive.fulfilled, (state, action) => {
                const index = state.clientes.findIndex(cliente => cliente.id === action.payload.id);
                if (index !== -1) {
                    state.clientes[index] = action.payload;
                }
                if (state.clienteDetalhe && state.clienteDetalhe.id === action.payload.id) {
                    state.clienteDetalhe = action.payload;
                }
            });
    }
});

export const { resetClientes } = clientesSlice.actions;
export default clientesSlice.reducer;
