import { api } from './'
import { FetchDataInterface, FetchResultInterface } from '@/types/interface/fetch'
import { UserInterface, UsersPayloadInterface } from '@/types/interface/user'

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserInterface[], UsersPayloadInterface>({
            query: (body) => ({ url: 'users/all', method: 'POST', body }),
            providesTags: ['Users'],
            transformResponse: (
                response: FetchDataInterface<UserInterface[]>
            ) => response.data,
            
        }),
        createUser: builder.mutation<
            FetchResultInterface<UserInterface>,
            Partial<UserInterface>
        >({
            query: (body) => ({
                url: `users`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation<
            UserInterface,
            Partial<UserInterface>
        >({
            query: (body) => ({
                url: `users`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        changeStatusUser: builder.mutation<FetchResultInterface,Partial<UserInterface>>({
            query: (body) => ({
                url: 'users/change_status',
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['Users'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetUsersQuery,useChangeStatusUserMutation, useDeleteUserMutation } = usersApi
