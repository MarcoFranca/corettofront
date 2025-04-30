import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';

interface ProfileState {
    data: {
        user: {
            first_name: string;
            last_name: string;
            username: string;
            email: string;
        };
        foto?: string | File;
        assinatura_status: string;
        email_confirmado?: boolean;
        plano?: {
            nome: string;
            descricao: string;
            preco: string;
            limite_subusuarios: number;
            tokens_chatgpt?: number; // pode adicionar se quiser
        } | null;
        current_period_end: string | null;
        tokens_extras_chatgpt: number; // 👈 adicionado aqui
    } | null;
    subUserData: { id: string; role: string; username: string } | null;
    subUsers: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    data: null,
    subUserData: null,
    subUsers: [],
    loading: false,
    error: null,
};

// Ação assíncrona para buscar o perfil
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
    const response = await api.get('/profiles/me/');
    return response.data;
});

// Ação assíncrona para buscar os subusuários
export const fetchSubUsers = createAsyncThunk('profile/fetchSubUsers', async () => {
    const response = await api.get('/subusuarios/');
    return response.data;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.subUserData = null;
            state.subUsers = [];
        },
        updateProfile: (state, action: PayloadAction<Partial<ProfileState['data']>>) => {
            if (state.data) {
                state.data = { ...state.data, ...action.payload };
            } else {
                state.data = action.payload as ProfileState['data']; // 🔥 Se era null, cria o profile completo
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.data = action.payload.profile;
                state.subUserData = action.payload.subuser || null;
                state.loading = false;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erro ao buscar o perfil.';
            })
            .addCase(fetchSubUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.subUsers = action.payload;
            });
    },
});

export const { clearProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
