import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    data: {
        first_name: string;
        last_name: string;
        assinatura_status: string;
        plano?: {
            nome: string;
            descricao: string;
            preco: string;
        } | null;
    } | null;
}

const initialState: ProfileState = {
    data: null, // Inicialmente, não há dados de perfil
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<ProfileState['data']>) => {
            state.data = action.payload;
        },
        clearProfile: (state) => {
            state.data = null;
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
