import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import {useGoogleLogin} from "@react-oauth/google";
import {toast} from "react-toastify";

// Estado inicial
interface GoogleIntegrationState {
    linkedAccount: { email: string; created_at: string; expiry?: string } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    message: string | null;
}

const initialState: GoogleIntegrationState = {
    linkedAccount: null,
    status: 'idle',
    error: null,
    message: null,
};

// Buscar informações da conta vinculada
export const fetchLinkedGoogleAccount = createAsyncThunk(
    'googleIntegration/fetchLinkedGoogleAccount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/google/credentials/');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                // Nenhuma conta vinculada: não é um erro crítico
                return null;
            }
            return rejectWithValue('⚠️ Erro ao buscar conta vinculada.');
        }
    }
);

// Vincular uma conta Google
export const linkGoogleAccount = createAsyncThunk(
    'googleIntegration/linkGoogleAccount',
    async (authorizationCode: string, { dispatch, rejectWithValue }) => {
        try {
            await api.post('/google/link-google-account/', { authorizationCode });
            dispatch(fetchLinkedGoogleAccount()); // Atualiza a conta vinculada
            toast.success('🔗 Conta Google vinculada com sucesso! 🎉');
            return '🔗 Conta Google vinculada com sucesso! 🎉';
        } catch (error: any) {
            if (error.response?.data?.error === 'Conta já vinculada.') {
                toast.warning('⚠️ Essa conta do Google já está vinculada a outro usuário. ' +
                    'Desvincule-a ou escolha outra conta.');
                return rejectWithValue(
                    '⚠️ Essa conta do Google já está vinculada a outro usuário. Desvincule-a ou escolha outra conta.'
                );
            }
            toast.error('🚨 Erro ao vincular conta Google. Tente novamente.');
            return rejectWithValue('🚨 Erro ao vincular conta Google. Tente novamente.');
        }
    }
);

//Reautoriza a conta
export const reauthorizeGoogleAccount = createAsyncThunk(
    'googleIntegration/reauthorizeGoogleAccount',
    async (_, { dispatch }) => {
        const loginWithGoogle = useGoogleLogin({
            flow: 'auth-code',
            onSuccess: (codeResponse) => {
                dispatch(linkGoogleAccount(codeResponse.code)); // Reautorização bem-sucedida
                toast.success('🔗 Conta Google vinculada com sucesso! 🎉');
            },
            onError: () => {
                toast.error('⚠️ Erro ao tentar reautorizar sua conta Google.');
            },
        });

        loginWithGoogle();
    }
);

// Desvincular uma conta Google
export const unlinkGoogleAccount = createAsyncThunk(
    'googleIntegration/unlinkGoogleAccount',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await api.post('/google/unlink-google-account/');
            dispatch(fetchLinkedGoogleAccount());
            return ' ⛓️ Conta Google desvinculada com sucesso! 🎉';
        } catch (error) {
            return rejectWithValue('⚠️ Erro ao desvincular conta Google.');
        }
    }
);

// Slice
const googleIntegrationSlice = createSlice({
    name: 'googleIntegration',
    initialState,
    reducers: {
        clearMessages(state) {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Buscar conta vinculada
            .addCase(fetchLinkedGoogleAccount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLinkedGoogleAccount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.linkedAccount = action.payload;
                state.error = null;
            })
            .addCase(fetchLinkedGoogleAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.linkedAccount = null;
                state.error = action.payload as string;
            })
            // Vincular conta Google
            .addCase(linkGoogleAccount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(linkGoogleAccount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload as string;
            })
            .addCase(linkGoogleAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Desvincular conta Google
            .addCase(unlinkGoogleAccount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(unlinkGoogleAccount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload as string;
                state.linkedAccount = null;
            })
            .addCase(unlinkGoogleAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = googleIntegrationSlice.actions;
export default googleIntegrationSlice.reducer;
