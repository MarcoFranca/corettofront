// store/slices/soundSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SoundState {
    soundOn: boolean;
    currentSound: string | null;
}

const initialState: SoundState = {
    soundOn: true,
    currentSound: null,
};

export const soundSlice = createSlice({
    name: 'sound',
    initialState,
    reducers: {
        setSoundOn: (state, action: PayloadAction<boolean>) => {
            state.soundOn = action.payload;
        },
        playSound: (state, action: PayloadAction<string>) => {
            state.currentSound = action.payload;
        },
        clearSound: (state) => {
            state.currentSound = null;
        }
    },
});

export const { setSoundOn, playSound, clearSound } = soundSlice.actions;
export default soundSlice.reducer;
