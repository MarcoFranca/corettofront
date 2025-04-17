// store/slices/todoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { message } from 'antd';
import {Meeting} from "@/types/AgendaInterfaces";

export interface Tarefa {
    id: string;
    title: string;
    description?: string;
    cliente?: string | null;
    cliente_label?: string;
    negociacao?: string;
    negociacao_titulo?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
    completed: boolean;
    repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
    repeat_count?: number;
    repeat_forever?: boolean;
    start_time?: string;
    end_time?: string;
    due_date?: string;
    add_to_google_calendar: boolean;
    created_at: string;
    updated_at: string;
}

interface TodoState {
    tarefas: Tarefa[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TodoState = {
    tarefas: [],
    status: 'idle',
    error: null,
};

export const fetchTarefas = createAsyncThunk(
    'tarefas/fetchTarefas',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/agenda/');
            return response.data;  // resposta já com cliente_label e negociacao_titulo
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const createTarefa = createAsyncThunk('todo/createTarefa', async (nova: Partial<Tarefa>, { dispatch }) => {
    const response = await api.post('/agenda/', {
        ...nova,
        entry_type: 'task',
    });
    message.success('Tarefa criada com sucesso!');
    dispatch(fetchTarefas());
    return response.data;
});

export const updateTarefa = createAsyncThunk('todo/updateTarefa', async ({ id, dados }: { id: string, dados: Partial<Tarefa> }, { dispatch }) => {
    const response = await api.patch(`/agenda/${id}/`, dados);
    message.success('Tarefa atualizada!');
    dispatch(fetchTarefas());
    return response.data;
});

export const deleteTarefa = createAsyncThunk<
    string,
    { id: string; emSerie?: boolean }
>('todo/deleteTarefa', async ({ id, emSerie }, { dispatch }) => {
    const url = emSerie ? `/agenda/${id}/?cancelar_em_serie=true` : `/agenda/${id}/`;
    await api.delete(url);
    dispatch(fetchTarefas());
    message.success('Tarefa cancelada');
    return id;
});


export const updateAgendaItem = createAsyncThunk<
    Meeting,
    { id: string; updatedItem: Partial<Meeting>; editarEmSerie?: boolean }
>(
    'agenda/updateAgendaItem',
    async ({ id, updatedItem, editarEmSerie }) => {
        const params = editarEmSerie ? '?editar_em_serie=true' : '';
        const response = await api.patch(`/agenda/${id}/${params}`, updatedItem);
        return response.data;
    }
);


export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTarefas.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTarefas.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tarefas = action.payload;
            })
            .addCase(fetchTarefas.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default todoSlice.reducer;
