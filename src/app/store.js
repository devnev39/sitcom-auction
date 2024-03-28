import { configureStore } from "@reduxjs/toolkit";
import CharacterReducer from "../feature/charactersSlice";
import UserReducer from '../feature/usersSlice';

export default configureStore({
   reducer: {
    character: CharacterReducer,
    user: UserReducer
   } 
});
