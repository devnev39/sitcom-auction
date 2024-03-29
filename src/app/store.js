import { configureStore } from "@reduxjs/toolkit";
import CharacterReducer from "../feature/charactersSlice";
import UserReducer from '../feature/usersSlice';
import TeamReducer from '../feature/teamsSlice';

export default configureStore({
   reducer: {
    character: CharacterReducer,
    user: UserReducer,
    team: TeamReducer,
   } 
});
