import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { AgendaState, AgendaItem } from '@/types/interfaces';
import moment from 'moment-timezone';

const timeZone = 'America/Sao_Paulo';

const initialState: AgendaState = {
    items: [],
    status: 'idle',
    error: null,
};

// Buscar itens da agenda
export const fetchAgendaItems = createAsyncThunk('agenda/fetchAgendaItems', async () => {
    const response = await api.get('/agenda/');
    return response.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start_time: item.start_time
            ? moment.tz(item.start_time, timeZone).toISOString()
            : null,
        end_time: item.end_time
            ? moment.tz(item.end_time, timeZone).toISOString()
            : null,
        type: item.entry_type,
        completed: item.completed,
        urgency: item.urgency,
        add_to_google_calendar: item.add_to_google_calendar,
        add_to_google_meet: item.add_to_google_meet,
        add_to_zoom: item.add_to_zoom,
        google_meet_link: item.google_meet_link,
        zoom_meeting_link: item.zoom_meeting_link,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }));

});

// Criar um item na agenda e atualizar a lista
export const createAgendaItem = createAsyncThunk<AgendaItem, Partial<AgendaItem>>(
    'agenda/createAgendaItem',
    async (newItem, { dispatch }) => {
        const response = await api.post('/agenda/', {
            title: newItem.title,
            description: newItem.description,
            start_time: moment(newItem.start_time).format(),
            end_time: moment(newItem.end_time).format(),
            entry_type: newItem.type,
            urgency: newItem.urgency,
            add_to_google_calendar: newItem.add_to_google_calendar,
            add_to_google_meet: newItem.add_to_google_meet,
            add_to_zoom: newItem.add_to_zoom,
            cliente: newItem.cliente || null,
        });

        // Dispara a ação para recarregar os itens após criar
        dispatch(fetchAgendaItems());

        return {
            ...response.data,
            start_time: moment.tz(response.data.start_time, timeZone).toDate(),
            end_time: moment.tz(response.data.end_time, timeZone).toDate(),
        };
    }
);


// Atualizar um item da agenda
export const updateAgendaItem = createAsyncThunk<AgendaItem, { id: string; updatedItem: Partial<AgendaItem> }>(
    'agenda/updateAgendaItem',
    async ({ id, updatedItem }) => {
        const response = await api.patch(`/agenda/${id}/`, updatedItem);
        return {
            ...response.data,
            start: moment.tz(response.data.start_time, timeZone).toDate(),
            end: moment.tz(response.data.end_time, timeZone).toDate(),
        };
    }
);

// Deletar um item da agenda
export const deleteAgendaItem = createAsyncThunk<string, string>('agenda/deleteAgendaItem', async (id) => {
    await api.delete(`/agenda/${id}/`);
    return id;
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
            })
            .addCase(createAgendaItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateAgendaItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            })
            .addCase(deleteAgendaItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const { resetAgenda } = agendaSlice.actions;
export default agendaSlice.reducer;
