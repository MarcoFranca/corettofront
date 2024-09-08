import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { AgendaState } from '@/types/interfaces';
import moment from "moment-timezone";

const initialState: AgendaState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchAgendaItems = createAsyncThunk('agenda/fetchAgendaItems', async () => {
    const response = await api.get('/agenda/');
    const { reunioes, tasks } = response.data;

    // Combine as reuniões e tasks
    const formattedReunioes = reunioes.map((reuniao: any) => ({
        id: reuniao.id,
        title: `Reunião com ${reuniao.cliente_nome}`,
        start: moment(`${reuniao.data_reuniao_agendada}T${reuniao.horario_inicio}`).toDate(), // Usando moment.js para converter a data corretamente
        end: moment(`${reuniao.data_reuniao_agendada}T${reuniao.horario_fim}`).toDate(), // Usando moment.js
        type: 'meeting',
    }));

    const formattedTasks = tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        start: moment(task.due_date).toDate(), // Convertendo a data da task usando moment.js
        end: moment(task.due_date).toDate(),
        type: 'task',
    }));

    return [...formattedReunioes, ...formattedTasks];
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
                // Certifique-se de que está lidando apenas com strings
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
