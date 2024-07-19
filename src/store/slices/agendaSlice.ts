import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Meeting, MeetingsState } from '@/types/interfaces';

const initialState: MeetingsState = {
    meetings: [],
    status: 'idle',
    error: null,
};

export const fetchMeetings = createAsyncThunk<Meeting[]>('meetings/fetchMeetings', async () => {
    const response = await api.get('/reunioes/');
    return response.data;
});

export const createMeeting = createAsyncThunk<Meeting, Partial<Meeting>>('meetings/createMeeting', async (newMeeting) => {
    const response = await api.post('/reunioes/', newMeeting);
    return response.data;
});

export const updateMeeting = createAsyncThunk<Meeting, { id: string; updatedMeeting: Partial<Meeting> }>('meetings/updateMeeting', async ({ id, updatedMeeting }) => {
    const response = await api.patch(`/reunioes/${id}/`, updatedMeeting);
    return response.data;
});

export const deleteMeeting = createAsyncThunk<string, string>('meetings/deleteMeeting', async (id) => {
    await api.delete(`/reunioes/${id}/`);
    return id;
});

const agendaSlice = createSlice({
    name: 'meetings',
    initialState,
    reducers: {
        resetAgenda: (state) => {
            state.meetings = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMeetings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.meetings = action.payload;
            })
            .addCase(fetchMeetings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.meetings.push(action.payload);
            })
            .addCase(updateMeeting.fulfilled, (state, action) => {
                const index = state.meetings.findIndex(meeting => meeting.id === action.payload.id);
                state.meetings[index] = { ...state.meetings[index], ...action.payload }; // Atualiza apenas os campos alterados
            })
            .addCase(deleteMeeting.fulfilled, (state, action) => {
                state.meetings = state.meetings.filter(meeting => meeting.id !== action.payload);
            });
    },
});

export const { resetAgenda } = agendaSlice.actions;
export default agendaSlice.reducer;
