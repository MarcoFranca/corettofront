import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        routeLoading: false,
    },
    reducers: {
        setRouteLoading: (state, action) => {
            state.routeLoading = action.payload;
        },
    },
});

export const { setRouteLoading } = uiSlice.actions;
export default uiSlice.reducer;
