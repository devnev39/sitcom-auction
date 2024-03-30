import { createSlice } from "@reduxjs/toolkit";

const teamsSlice = createSlice({
    name: 'team',
    initialState: {
        teams: [],
        currentTeam: {}
    },
    reducers: {
        setTeams: (state, action) => {
            state.teams = state.teams.concat(action.payload);
        },

        removeTeam: (state, action) => {
            state.teams = state.teams.filter((t) => t.id != action.payload);
        },

        clearTeams: (state) => {
            state.teams = [];
        },

        updateTeam: (state, action) => {
            const ind = state.teams.findIndex((t) => t.id == action.payload.id);
            state.teams.splice(ind, 1, action.payload);
        },

        setCurrentTeam: (state, action) => {
            state.currentTeam = action.payload;
        },
    }
})

export const {setTeams, removeTeam, clearTeams, updateTeam, setCurrentTeam} = teamsSlice.actions;
export default teamsSlice.reducer;
