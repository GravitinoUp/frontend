import {
    Middleware,
    configureStore,
    isRejectedWithValue,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import i18next from 'i18next'
import { api } from './api'
import authReducer from './reducers/authSlice'
import { toast } from '@/components/ui/use-toast'
import { ErrorInterface } from '@/types/interface/fetch'

const errorHandlerMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const { data } = action.payload as {
            status: number
            data: ErrorInterface
        }

        toast({
            variant: 'destructive',
            title: i18next.t('toast.error.title'),
            description: data.text,
            duration: 3000,
        })
    }

    return next(action)
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(errorHandlerMiddleware)
            .concat(api.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
