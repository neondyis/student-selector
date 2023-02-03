// Type for our state
import {createSlice} from "@reduxjs/toolkit";
import {AppState} from "@/redux/store";

export interface BlockState {
    room: string;
    name: string;
}

// Initial state
const initialState: BlockState = {
    room: '',
    name: ''
};

export const blockSlice = createSlice({
    name: "app",
    initialState,
    reducers: {

        setName(state, action) {
            state.name = action.payload;
        },
        setRoom(state, action) {
            state.room = action.payload;
        },
    },
});

export const { setRoom, setName } = blockSlice.actions;

export const selectName = (state: AppState) => state.app.name;
export const selectRoom = (state: AppState) => state.app.room;

export default blockSlice.reducer;