import { api } from './'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import { RoleInterface, RolesPayloadInterface } from '@/types/interface/roles'

export const rolesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<RoleInterface[], RolesPayloadInterface>({
            query: (body) => ({
                url: 'roles/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<RoleInterface[]>
            ) => response.data,
            providesTags: ['Roles'],
        }),
        addRole: builder.mutation<
            FetchResultInterface<RoleInterface>,
            Partial<RoleInterface>
        >({
            query: (body) => ({
                url: 'roles',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Roles'],
        }),
        updateRole: builder.mutation<RoleInterface, Partial<RoleInterface>>({
            query: (body) => ({
                url: 'roles',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Roles'],
        }),
        deleteRole: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Roles'],
        }),
    }),
})

export const {
    useGetRolesQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = rolesApi
