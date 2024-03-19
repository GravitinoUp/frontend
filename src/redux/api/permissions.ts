import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    PermissionsInterface,
    RolePermissionInterface,
} from '@/types/interface/roles'

const permissionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPermissions: builder.query<PermissionsInterface[], void>({
            query: () => 'permissions/all',
            transformResponse: (
                response: FetchDataInterface<PermissionsInterface[]>
            ) => response.data,
        }),
        getPersonalPermissions: builder.query<RolePermissionInterface[], void>({
            query: () => 'roles-permissions/my',
            transformResponse: (
                response: FetchDataInterface<RolePermissionInterface[]>
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPermissionsQuery, useGetPersonalPermissionsQuery } =
    permissionsApi
