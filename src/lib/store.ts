"use client"

import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import authReducer from "../lib/slices/auth-slices"
import examReducer from "../lib/slices/exam-slices"
import { api } from "./api"

const rootReducer = combineReducers({
  auth: authReducer,
  exam: examReducer,
  [api.reducerPath]: api.reducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "exam"],
}

const persisted = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) => getDefault({ serializableCheck: false }).concat(api.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
