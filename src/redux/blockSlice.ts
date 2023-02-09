// Type for our state
import {createSlice} from "@reduxjs/toolkit";
import {AppState} from "@/redux/store";

export type BlockState = {
    id: string;
    code: string;
    name: string;
    blocks: Block[];
}

export type Block = {
    info: string,
    user: string,
    isShown: boolean;
}

// Initial state
const initialState: BlockState = {
    id: '',
    code: '',
    name: '',
    blocks: []
};

export const blockSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setId(state, action) {
            state.id = action.payload;
        },

        setName(state, action) {
            state.name = action.payload;
        },
        setCode(state, action) {
            state.code = action.payload;
        },
        setBlocks(state, action) {
            state.blocks = [...action.payload];     
        },
    },
});

export const { setId, setCode , setName, setBlocks } = blockSlice.actions;

export const selectId = (state: AppState) => state.app.id;
export const selectName = (state: AppState) => state.app.name;
export const selectBlocks = (state: AppState) => state.app.blocks;
export const selectCode = (state: AppState) => state.app.code;

export default blockSlice.reducer;