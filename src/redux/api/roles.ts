import { api } from './'
import { FetchResultInterface } from '@/types/interface/fetch'
import { RoleInterface, RolesPayloadInterface } from '@/types/interface/roles'

export const rolesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<RoleInterface[], RolesPayloadInterface>({
            query: (body) => ({
                url: 'roles/all',
                method: 'POST',
                body,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ role_id }) => ({
                              type: 'Roles' as const,
                              id: role_id,
                          })),
                          { type: 'Roles', id: 'LIST' },
                      ]
                    : [{ type: 'Roles', id: 'LIST' }],
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
            invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
        }),
        updateRole: builder.mutation<RoleInterface, Partial<RoleInterface>>({
            query: (body) => ({
                url: 'roles',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
        }),
        deleteRole: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `roles/${id}`,
                method: 'DELETE',
            }),
            // invalidatesTags: (result, error, id) => [{ type: 'Roles', id }],
        }),
    }),
})

export const {
    useGetRolesQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = rolesApi
