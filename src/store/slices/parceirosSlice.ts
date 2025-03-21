import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/app/api/axios";

// 🛠 Definição dos Tipos
export interface Cliente {
    id: string;
    nome: string;
}

export interface Parceiro {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
    comissao: number;
    tipo: string;
    ativo: boolean;
    clientes_indicados: Cliente[];
}

interface ParceirosState {
    parceiros: Parceiro[];
    selectedParceiro: Parceiro | null;
}

// Estado inicial tipado corretamente
const initialState: ParceirosState = {
    parceiros: [],
    selectedParceiro: null,
};

// Buscar todos os parceiros
export const fetchParceiros = createAsyncThunk<Parceiro[]>("parceiros/fetchParceiros", async () => {
    try {
        const response = await api.get("/parceiros/");
        console.log("🔍 Dados recebidos da API (fetchParceiros):", response.data);
        return response.data.length > 0 ? response.data : []; // ✅ Se estiver vazio, retorna `[]`
    } catch (error) {
        console.error("❌ Erro ao buscar parceiros:", error);
        return []; // ✅ Garante que o Redux terá sempre um array, nunca `null`
    }
});


// Buscar um parceiro pelo ID
export const fetchParceiroById = createAsyncThunk<Parceiro, string>("parceiros/fetchParceiroById", async (id) => {
    const response = await api.get(`/parceiros/${id}/`);
    console.log(`🔍 Dados recebidos da API para parceiro ${id}:`, response.data); // ✅ Verifica os dados no console
    return response.data;
});


// Criar um parceiro
export const createParceiro = createAsyncThunk<Parceiro, Omit<Parceiro, "id">>("parceiros/createParceiro", async (parceiroData) => {
    const response = await api.post("/parceiros/", parceiroData);
    return response.data;
});

// Atualizar um parceiro
export const updateParceiro = createAsyncThunk<Parceiro, { id: string; parceiroData: Partial<Parceiro> }>(
    "parceiros/updateParceiro",
    async ({ id, parceiroData }) => {
        const response = await api.patch(`/parceiros/${id}/`, parceiroData);
        return response.data;
    }
);

// Criando o Slice
const parceirosSlice = createSlice({
    name: "parceiros",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchParceiros.fulfilled, (state, action: PayloadAction<Parceiro[]>) => {
                state.parceiros = action.payload;
            })
            .addCase(fetchParceiroById.fulfilled, (state, action: PayloadAction<Parceiro>) => {
                state.selectedParceiro = action.payload;
            })
            .addCase(createParceiro.fulfilled, (state, action: PayloadAction<Parceiro>) => {
                state.parceiros.push(action.payload);
            })
            .addCase(updateParceiro.fulfilled, (state, action: PayloadAction<Parceiro>) => {
                const index = state.parceiros.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.parceiros[index] = action.payload;
                }
            });
    },
});

export default parceirosSlice.reducer;
