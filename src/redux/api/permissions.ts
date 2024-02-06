import { api } from './'
import { PermissionsInterface } from '@/types/interface/roles'

const permissionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPermissions: builder.query<PermissionsInterface[], void>({
            query: () => 'permissions/all',
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPermissionsQuery } = permissionsApi
