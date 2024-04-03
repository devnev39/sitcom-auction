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
            state.characters.splice(index, 1, action.payload);
        },

        removeCharacter: (state, action) => {
            state.characters = state.characters.filter((c) => c.id != action.payload);
        },

        clearCharacters: (state) => {
            state.characters = [];
            state.loaded = false;
        },

        onUpdateCharacters : (state, action) => {
            action.payload.forEach((chr) => {
                const index = state.characters.findIndex((c) => c.id == chr.id);
                state.characters.splice(index, 1, chr);
            });
        }
    }
})

export const {setCharacters, updateCharacters, removeCharacter, clearCharacters, onUpdateCharacters} = charactersSlice.actions;

export default charactersSlice.reducer;
