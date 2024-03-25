import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getJWTtokens } from '@/utils/helpers'

export const api = createApi({
    reducerPath: 'api',
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API,
        prepareHeaders: async (headers) => {
            const { accessToken, refreshToken } = getJWTtokens()

            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`)
            } else {
                if (refreshToken) {
                    const refreshHeaders = new Headers()
                    refreshHeaders.append('Content-Type', 'application/json')

                    const requestOptions = {
                        method: 'POST',
                        headers: refreshHeaders,
                        body: JSON.stringify({
                            refresh_token: refreshToken,
                        }),
                    }

                    const response = await fetch(
                        `${import.meta.env.VITE_API}/auth/refresh`,
                        requestOptions
                    )

                    if (response.ok) {
                        const newAccessToken = await response.text()
                        document.cookie = `accessToken=${newAccessToken}; Max-Age=43200`
                        headers.set('Authorization', `Bearer ${newAccessToken}`)
                    }
                }
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
        'NeighboringStates',
        'CheckpointTypes',
        'WorkingHours',
        'OperatingMode',
        'OrderJournal',
        'Reports',
        'OrderStatuses',
        'SavedReports',
    ],
    endpoints: () => ({}),
})
