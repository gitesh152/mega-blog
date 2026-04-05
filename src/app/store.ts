import { configureStore } from "@reduxjs/toolkit";
import  AuthReducer from './features/auth/authSlice'
import ThemeReducer from "./features/theme/themeSlice";

export const store = configureStore({
    reducer : {
        auth: AuthReducer,
        theme: ThemeReducer
    }
 })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch