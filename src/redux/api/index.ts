import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getJWTtokens } from '@/utils/helpers'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API,
        prepareHeaders: (headers) => {
            const { accessToken } = getJWTtokens()

            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`)
            }

            return headers
        },
    }),
    tagTypes: [
        'Roles',
        'Branches',
        'Orders',
        'Permissions',
        'Organizations',
        'Priority',
        'OrganizationTypes',
        'Users',
        'Checkpoints',
        'Properties',
        'Groups',
        'Reports',
    ],
    endpoints: () => ({}),
})
