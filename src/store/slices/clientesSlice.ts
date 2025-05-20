import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Cliente, ClientesState } from '@/types/interfaces';
import { Saude } from "@/types/interfaces";

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

export const fetchClientesNegociacoes = createAsyncThunk(
    'clientes/fetchClientesNegociacoes',
    async () => {
        const response = await api.get('/clientes/negociacoes/');
        return response.data;
    }
);

export const fetchTodosClientesFiltrados = createAsyncThunk<Cliente[], { status?: string[] }>(
    'clientes/fetchTodosClientesFiltrados',
    async ({ status }, { rejectWithValue }) => {
        try {
            let statusQuery = '';
            if (Array.isArray(status) && status.length > 0) {
                statusQuery = `status__in=${status.map(encodeURIComponent).join(',')}`;
            }

            // 1. Requisição inicial para pegar o count
            const firstUrl = `/clientes/?${statusQuery}&limit=100/`;
            const firstResponse = await api.get(firstUrl);
            const { results: firstResults, count, next } = firstResponse.data;

            // 2. Se só tem uma página, retorna direto
            if (!next) {
                return firstResults;
            }

            // 3. Calcula quantas páginas tem no total
            const totalPages = Math.ceil(count / 100);

            // 4. Monta as urls das próximas páginas (começa em 1 porque já pegou a primeira)
            const urls = [];
            for (let i = 1; i < totalPages; i++) {
                const offset = i * 100;
                urls.push(`/clientes/?${statusQuery}&limit=100/&offset=${offset}`);
            }

            // 5. Faz todas as requisições das páginas em paralelo
            const responses = await Promise.all(urls.map(url => api.get(url)));
            const allResults = responses.flatMap(r => r.data.results);

            // 6. Junta os resultados da primeira página + todas as outras
            return [...firstResults, ...allResults];
        } catch (error: any) {
            console.error("❌ Erro ao buscar todos os clientes filtrados:", error);
            return rejectWithValue(error.response?.data || "Erro desconhecido ao buscar clientes");
        }
    }
);



export const fetchClienteById = createAsyncThunk(
    'clientes/fetchById',
    async (id: string) => {
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


export const createCliente = createAsyncThunk<Cliente,  Partial<Cliente>>(
    'clientes/createCliente',
    async (novoCliente, { dispatch }) => {
        const response = await api.post('/clientes/', novoCliente);
        dispatch(fetchTodosClientesFiltrados({ status: ["lead", "negociacao", "nova_negociacao"] }));
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
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log("✅ Cliente atualizado com sucesso:", response.data);

            dispatch(fetchTodosClientesFiltrados({ status: ["lead", "negociacao", "nova_negociacao"] }));
            dispatch(fetchClienteDetalhe(id));

            return response.data;
        } catch (error) {
            console.error("❌ Erro ao atualizar cliente:", error);
            throw error;
        }
    }
);

export const updateClienteSaude = createAsyncThunk<
    Saude, // Retorno
    { id: string; saudeData: Partial<Saude> }
>("clientes/updateClienteSaude", async ({ id, saudeData }, { dispatch }) => {
    const response = await api.patch(`/saude/${id}/`, saudeData);

    // Atualiza os dados completos do cliente
    dispatch(fetchClienteDetalhe(id));

    return response.data;
});


export const deleteCliente = createAsyncThunk<string, string>('clientes/deleteCliente', async (id, { dispatch }) => {
    await api.delete(`/clientes/${id}/`);
    dispatch(fetchTodosClientesFiltrados({ status: ["lead", "negociacao", "nova_negociacao"] }));
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
            .addCase(fetchClientesNegociacoes.fulfilled, (state, action) => {
                state.clientes = action.payload;
                state.totalClientes = action.payload.length;
                state.status = 'succeeded';
            })
            .addCase(fetchClientes.fulfilled, (state, action) => {
                console.log("📢 Atualizando Redux com clientes da página:", action.payload.results);
                state.status = 'succeeded';
                state.clientes = action.payload.results; // Usa 'results' da resposta paginada
                state.totalClientes = action.payload.count; // Guarda o número total de clientes
            })
            .addCase(fetchTodosClientesFiltrados.fulfilled, (state, action) => {
                console.log("✅ Todos os clientes recebidos:", action.payload);
                state.clientes = action.payload;
                state.totalClientes = action.payload.length;
                state.status = 'succeeded';
            })
            .addCase(fetchTodosClientesFiltrados.rejected, (state, action) => {
                console.error("❌ Erro ao buscar todos os clientes filtrados:", action.error.message);
                state.status = 'failed';
                state.error = action.error.message || "Erro ao buscar todos os clientes filtrados";
            })
            .addCase(fetchClienteById.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.clientes.findIndex(c => c.id === updated.id);
                if (index !== -1) {
                    state.clientes[index] = updated;
                } else {
                    state.clientes.push(updated);
                }
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
                if (state.clienteDetalhe) {
                    state.clienteDetalhe.relacionamentos = {
                        ...(state.clienteDetalhe.relacionamentos || {}),
                        saude: action.payload
                    };
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
