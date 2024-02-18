import { api } from '.'
import {
    AuthPayloadInterface,
    RefreshPayloadInterface,
    TokenInterface,
} from '@/types/interface/auth'

const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        auth: builder.mutation<TokenInterface, AuthPayloadInterface>({
            query: (body) => ({
                url: 'auth',
                method: 'POST',
                body,
            }),
        }),
        refreshToken: builder.mutation<string, RefreshPayloadInterface>({
            query: (body) => ({
                url: 'auth/refresh',
                method: 'POST',
                body,
                responseHandler: (response) => response.text(),
            }),
        }),
        logout: builder.mutation<void, RefreshPayloadInterface>({
            query: (body) => ({
                url: 'auth/logout',
                method: 'DELETE',
                body,
            }),
        }),
    }),
})

export const { useAuthMutation, useRefreshTokenMutation, useLogoutMutation } =
    authApi
