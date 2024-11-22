import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import { Meeting, MeetingsState } from '@/types/interfaces';


const initialState: MeetingsState = {
    meetings: [],
    status: 'idle',
    error: null,
};

// Fetch all meetings
export const fetchMeetings = createAsyncThunk<Meeting[]>('meetings/fetchMeetings', async () => {
    const response = await api.get('/agenda/'); // Atualizado para o endpoint correto
    return response.data;
});

// Fetch meetings for a specific client
export const fetchClientMeetings = createAsyncThunk<Meeting[], string>('meetings/fetchClientMeetings', async (clientId) => {
    const response = await api.get(`/agenda/?cliente=${clientId}`); // Atualizado para o endpoint correto
    return response.data;
});

export const createMeeting = createAsyncThunk<Meeting, Partial<Meeting>>(
    'meetings/createMeeting',
    async (newMeeting, { rejectWithValue }) => {
        console.log('Dados enviados ao backend:', newMeeting);
        try {
            const response = await api.post('/agenda/', newMeeting);
            console.log('Resposta do backend:', response.data);
            return response.data;
        } catch (err: unknown) {
            const error = err as any; // Faz o casting explícito do tipo
            const errorData = error.response?.data;
            console.error('Erro ao criar reunião:', errorData || error.message);

            // Verifica se o erro possui um redirecionamento
            if (errorData?.redirect_url) {
                return rejectWithValue({ redirect_url: errorData.redirect_url });
            }

            throw error; // Lança o erro para ser tratado normalmente
        }
    }
);




export const updateMeeting = createAsyncThunk<Meeting, { id: string; updatedMeeting: Partial<Meeting> }>(
    'meetings/updateMeeting',
    async ({ id, updatedMeeting }) => {
        const response = await api.patch(`/agenda/${id}/`, updatedMeeting); // Atualizado para o endpoint correto
        return response.data;
    }
);

export const deleteMeeting = createAsyncThunk<string, string>('meetings/deleteMeeting', async (id) => {
    await api.delete(`/agenda/${id}/`); // Atualizado para o endpoint correto
    return id;
});

const meetingSlice = createSlice({
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
                const exists = state.meetings.some(meeting => meeting.id === action.payload.id);
                if (!exists) {
                    state.meetings.push(action.payload);
                }
            })
            .addCase(updateMeeting.fulfilled, (state, action) => {
                const index = state.meetings.findIndex(meeting => meeting.id === action.payload.id);
                if (index !== -1) {
                    state.meetings[index] = { ...state.meetings[index], ...action.payload };
                }
            })
            .addCase(deleteMeeting.fulfilled, (state, action) => {
                state.meetings = state.meetings.filter(meeting => meeting.id !== action.payload);
            });
    },
});

export const { resetAgenda } = meetingSlice.actions;
export default meetingSlice.reducer;
