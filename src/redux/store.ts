import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './api'
import authReducer from './reducers/userSlice'
import { ymapsApi } from './ymaps-api'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
        [ymapsApi.reducerPath]: ymapsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Это нужно для refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)
