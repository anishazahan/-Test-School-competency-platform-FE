"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Tokens, User } from "@/lib/types"

interface AuthState {
  user: User | null | undefined
  tokens: Tokens | null | undefined
}

const initialState: AuthState = {
  user: null,
  tokens: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null | undefined>) {
      state.user = action.payload
    },
    setTokens(state, action: PayloadAction<Tokens | null | undefined>) {
      state.tokens = action.payload
    },
    signOut(state) {
      state.user = null
      state.tokens = null
    },
  },
})

export const { setUser, setTokens, signOut } = authSlice.actions
export default authSlice.reducer
