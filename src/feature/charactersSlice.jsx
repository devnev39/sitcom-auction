import { createSlice } from "@reduxjs/toolkit";

const charactersSlice = createSlice({
    name: 'character',
    initialState: {
        loaded: false,
        characters: []
    },
    reducers: {
        setCharacters: (state, action) => {
            state.characters = state.characters.concat(action.payload);
            state.loaded = true;
        },

        updateCharacters: (state, action) => {
            const index = state.characters.findIndex((c) => c.id == action.payload.id);
            state.characters = state.characters.filter((c) => c.id != action.payload.id);
            state.characters.splice(index, 0, action.payload);
        },

        removeCharacter: (state, action) => {
            state.characters = state.characters.filter((c) => c.id != action.payload);
        },

        clearCharacters: (state) => {
            state.characters = [];
            state.loaded = false;
        }
    }
})

export const {setCharacters, updateCharacters, removeCharacter, clearCharacters} = charactersSlice.actions;

export default charactersSlice.reducer;
