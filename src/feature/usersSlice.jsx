import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: []
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = state.users.concat(action.payload);
        },

        removeUser: (state, action) => {
            state.users = state.users.filter((u) => u.id != action.payload);
        },
        
        clearUsers: (state, action) => {
            state.users = [];
        }
    }
})

export const {setUsers, removeUser, clearUsers} = userSlice.actions;
export default userSlice.reducer;
