import { api } from './'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import {
    PermissionsInterface,
    RolePermissionInterface,
    UserPermissionsPayload,
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
        setRolePermissions: builder.mutation<
            FetchResultInterface<RolePermissionInterface>,
            UserPermissionsPayload
        >({
            query: (body) => ({
                url: 'roles-permissions/bulk-create',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetAllPermissionsQuery,
    useGetPersonalPermissionsQuery,
    useSetRolePermissionsMutation,
} = permissionsApi
