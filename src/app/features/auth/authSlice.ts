import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthUser } from "../../../types/auth";

export  interface AuthState {
status: boolean,
userData: AuthUser | null;
}

const initialState: AuthState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name:'auth',initialState,
    reducers: {
        login:(state,action: PayloadAction<{userData: AuthUser}>)=>{
             state.status = true
             state.userData = action.payload.userData
        },
        logout:(state)=>{
             state.status = false
             state.userData = null
        },
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer