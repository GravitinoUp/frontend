import { api } from './'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import {
    OrganizationUserPayloadInterface,
    UserInterface,
    UserPayloadInterface,
    UsersPayloadInterface,
} from '@/types/interface/user'

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<
            FetchDataInterface<UserInterface[]>,
            UsersPayloadInterface
        >({
            query: (body) => ({ url: 'users/all', method: 'POST', body }),
            providesTags: ['Users'],
        }),
        getMyUser: builder.query<UserInterface, void>({
            query: () => ({ url: `users/user/my`, method: 'GET' }),
            providesTags: ['Users'],
        }),
        getUserById: builder.query<UserInterface, number>({
            query: (id) => ({ url: `users/${id}`, method: 'GET' }),
            providesTags: ['Users'],
        }),
        createUser: builder.mutation<
            FetchResultInterface<UserInterface>,
            UserPayloadInterface
        >({
            query: (body) => ({
                url: 'users',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        createOrganization: builder.mutation<
            FetchResultInterface<UserInterface>,
            OrganizationUserPayloadInterface
        >({
            query: (body) => ({
                url: 'users/organization',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Organizations'],
        }),
        updateUser: builder.mutation<
            UserInterface,
            Partial<UserPayloadInterface>
        >({
            query: (body) => ({
                url: `users`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        updateOrganization: builder.mutation<
            FetchResultInterface<UserInterface>,
            OrganizationUserPayloadInterface
        >({
            query: (body) => ({
                url: 'users/organization',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Organizations'],
        }),
        deleteUser: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users', 'Organizations'],
        }),
        changeUserStatus: builder.mutation<
            FetchResultInterface,
            Partial<UserInterface>
        >({
            query: (body) => ({
                url: 'users/change_status',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        resetUserPassword: builder.mutation<FetchResultInterface, string>({
            query: (userId) => ({
                url: `users/reset-password?user_id=${userId}`,
                method: 'PATCH',
            }),
        }),
        updateUserPassword: builder.mutation<FetchResultInterface, string>({
            query: (password) => ({
                url: 'users/update-password',
                method: 'PATCH',
                body: {
                    password,
                },
            }),
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetUsersQuery,
    useGetMyUserQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useCreateOrganizationMutation,
    useUpdateUserMutation,
    useUpdateOrganizationMutation,
    useChangeUserStatusMutation,
    useDeleteUserMutation,
    useResetUserPasswordMutation,
    useUpdateUserPasswordMutation,
} = usersApi
