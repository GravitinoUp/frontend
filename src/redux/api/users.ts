import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import { UserInterface, UsersPayloadInterface } from '@/types/interface/user'

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<
            FetchDataInterface<UserInterface[]>,
            UsersPayloadInterface
        >({
            query: (body) => ({ url: 'users/all', method: 'POST', body }),
        }),
        getUserById: builder.query<UserInterface, number>({
            query: (id) => ({ url: `users/${id}`, method: 'GET' }),
        }),
    }),
    overrideExisting: true,
})

export const { useGetUsersQuery, useGetUserByIdQuery } = usersApi
