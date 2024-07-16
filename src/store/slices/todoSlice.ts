import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Task, TasksState } from '@/types/interfaces';

const initialState: TasksState = {
    tasks: [],
    status: 'idle',
    error: null,
};

export const fetchTasks = createAsyncThunk<Task[]>('tasks/fetchTasks', async () => {
    const response = await api.get('/tasks/');
    return response.data;
});

export const createTask = createAsyncThunk<Task, Partial<Task>>('tasks/createTask', async (newTask) => {
    const response = await api.post('/tasks/', newTask);
    return response.data;
});

export const updateTask = createAsyncThunk<Task, { id: string; updatedTask: Partial<Task> }>('tasks/updateTask', async ({ id, updatedTask }) => {
    const response = await api.patch(`/tasks/${id}/`, updatedTask);
    return response.data;
});

export const deleteTask = createAsyncThunk<string, string>('tasks/deleteTask', async (id) => {
    await api.delete(`/tasks/${id}/`);
    return id;
});

const todoSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                state.tasks[index] = { ...state.tasks[index], ...action.payload }; // Atualiza apenas os campos alterados
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            });
    },
});

export default todoSlice.reducer;
