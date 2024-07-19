import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Cliente, ClientesState } from '@/types/interfaces';

const initialState: ClientesState = {
    clientes: [],
    status: 'idle',
    error: null,
};

export const fetchClientes = createAsyncThunk<Cliente[], { status?: string, search?: string } | undefined>(
    'clientes/fetchClientes',
    async (params) => {
        console.log('Fetching clientes with params:', params);  // Adiciona log para verificar os parâmetros
        const response = await api.get('/clientes/', { params });
        console.log('API response:', response.data);  // Adiciona log para verificar a resposta da API
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

export const deleteCliente = createAsyncThunk<string, string>('clientes/deleteCliente', async (id, { dispatch }) => {
    await api.delete(`/clientes/${id}/`);
    dispatch(fetchClientes());
    return id;
});

const clientesSlice = createSlice({
    name: 'clientes',
    initialState,
    reducers: {
        resetClientes: (state) => {
            state.clientes = [];
            state.status = 'idle';
            state.error = null;
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
                console.log('Clientes atualizados:', state.clientes);  // Adiciona log para verificar o estado atualizado
            })
            .addCase(fetchClientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
                console.log('Erro ao buscar clientes:', state.error);  // Adiciona log para verificar o erro
            })
            .addCase(createCliente.fulfilled, (state, action) => {
                state.clientes.push(action.payload);
            })
            .addCase(updateCliente.fulfilled, (state, action) => {
                const index = state.clientes.findIndex(cliente => cliente.id === action.payload.id);
                state.clientes[index] = action.payload;
            })
            .addCase(deleteCliente.fulfilled, (state, action) => {
                state.clientes = state.clientes.filter(cliente => cliente.id !== action.payload);
            });
    },
});

export const { resetClientes } = clientesSlice.actions;
export default clientesSlice.reducer;
