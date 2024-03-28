import { configureStore } from "@reduxjs/toolkit";
import CharacterReducer from "../feature/charactersSlice";

export default configureStore({
   reducer: {
    character: CharacterReducer
   } 
});
