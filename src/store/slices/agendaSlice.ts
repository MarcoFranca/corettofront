import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { AgendaItem, AgendaState } from '@/types/interfaces';

const initialState: AgendaState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchAgendaItems = createAsyncThunk<AgendaItem[]>('agenda/fetchAgendaItems', async () => {
    const response = await api.get('/agenda/');
    return response.data;
});

const agendaSlice = createSlice({
    name: 'agenda',
    initialState,
    reducers: {
        resetAgenda: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgendaItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAgendaItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAgendaItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { resetAgenda } = agendaSlice.actions;
export default agendaSlice.reducer;
