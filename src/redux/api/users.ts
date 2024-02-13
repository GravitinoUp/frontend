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
        createOrganizationUser: builder.mutation<
            FetchResultInterface<UserInterface>,
            OrganizationUserPayloadInterface
        >({
            query: (body) => ({
                url: 'users/organization',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Users'],
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
        updateOrganizationUser: builder.mutation<
            FetchResultInterface<UserInterface>,
            OrganizationUserPayloadInterface
        >({
            query: (body) => ({
                url: 'users/organization',
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
    }),
    overrideExisting: true,
})

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useCreateOrganizationUserMutation,
    useUpdateUserMutation,
    useUpdateOrganizationUserMutation,
    useChangeUserStatusMutation,
    useDeleteUserMutation,
} = usersApi
