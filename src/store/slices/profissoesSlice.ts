// store/slices/profissoesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchProfissoesOrganizadas } from "@/app/components/ui/select/selectUtils";
import type { ProfissaoGroup } from "@/types/profissao";

// Estado tipado corretamente!
type ProfissoesState = {
    data: ProfissaoGroup[];
    loading: boolean;
};

const initialState: ProfissoesState = {
    data: [],
    loading: false,
};

export const fetchProfissoesThunk = createAsyncThunk(
    "profissoes/fetchAll",
    async () => await fetchProfissoesOrganizadas()
);

const profissoesSlice = createSlice({
    name: "profissoes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfissoesThunk.pending, (state) => { state.loading = true; })
            .addCase(fetchProfissoesThunk.fulfilled, (state, action: PayloadAction<ProfissaoGroup[]>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProfissoesThunk.rejected, (state) => { state.loading = false; });
    },
});

export default profissoesSlice.reducer;
