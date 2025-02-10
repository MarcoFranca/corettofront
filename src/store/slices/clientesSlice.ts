import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Cliente, ClientesState } from '@/types/interfaces';

const initialState: ClientesState = {
    clientes: [],
    clienteDetalhe: null,
    totalClientes: 0, // Novo estado para armazenar a quantidade total de clientes
    status: 'idle',
    statusDetalhe: 'idle',
    error: null,
    errorDetalhe: null,
};


export const fetchClientes = createAsyncThunk<
    { results: Cliente[]; count: number },
    { status?: string; search?: string; page?: number; limit?: number } | undefined
>("clientes/fetchClientes", async (params) => {
    const response = await api.get("/clientes/", { params });
    console.log('clientes da pagina', response.data.results)
    return {
        results: response.data.results, // ✅ Apenas os clientes da página atual
        count: response.data.count, // ✅ Total de clientes
    };
});

export const fetchClientesSearch = createAsyncThunk<
    { results: Cliente[]; count: number },
    { search: string }
>("clientes/fetchClientesSearch", async ({ search }) => {
    const response = await api.get("/clientes/", { params: { search } });
    console.log("📢 Buscando clientes por nome:", search);
    console.log("📢 Resposta da API:", response.data);
    return {
        results: response.data.results,
        count: response.data.count,
    };
});


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
        try {
            const response = await api.patch(
                `/clientes/${id}/`,
                { status },  // Certifique-se de que está enviando um objeto JSON válido
                {
                    headers: {
                        'Content-Type': 'application/json', // Garante que estamos enviando JSON
                    },
                }
            );

            dispatch(fetchClienteDetalhe(id)); // Atualiza os detalhes do cliente após a alteração
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            throw error;
        }
    }
);


export const createCliente = createAsyncThunk<Cliente, Cliente>('clientes/createCliente', async (novoCliente, { dispatch }) => {
    const response = await api.post('/clientes/', novoCliente);
    dispatch(fetchClientes());
    return response.data;
});

export const updateCliente = createAsyncThunk<
    Cliente,
    { id: string; updatedCliente: Partial<Cliente> }
>(
    'clientes/updateCliente',
    async ({ id, updatedCliente }, { dispatch }) => {
        try {
            console.log("📌 Enviando atualização para cliente ID:", id);
            console.log("📌 Dados enviados:", JSON.stringify(updatedCliente, null, 2)); // 🔥 Log completo

            const response = await api.patch(`/clientes/${id}/`, {
                ...updatedCliente,
                endereco: updatedCliente.endereco || {}, // 🔥 Garante que o campo `endereco` está presente
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log("✅ Cliente atualizado com sucesso:", response.data);

            dispatch(fetchClientes());
            dispatch(fetchClienteDetalhe(id));

            return response.data;
        } catch (error) {
            console.error("❌ Erro ao atualizar cliente:", error);
            throw error;
        }
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
            state.totalClientes = 0;
            state.clienteDetalhe = null;
            state.status = "idle";
            state.statusDetalhe = "idle";
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
                console.log("📢 Atualizando Redux com clientes da página:", action.payload.results);
                state.status = 'succeeded';
                state.clientes = action.payload.results; // Usa 'results' da resposta paginada
                state.totalClientes = action.payload.count; // Guarda o número total de clientes
            })
            .addCase(fetchClientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchClientesSearch.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchClientesSearch.fulfilled, (state, action) => {
                console.log("🔍 Resultados da busca:", action.payload.results);
                state.status = "succeeded";
                state.clientes = action.payload.results; // 🔥 Sempre substitui clientes com a busca
                state.totalClientes = action.payload.count;
            })
            .addCase(fetchClientesSearch.rejected, (state, action) => {
                state.status = "failed";
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
