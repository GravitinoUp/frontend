import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ymapsApi = createApi({
    reducerPath: 'ymapsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.YMAPS_API,
    }),
    tagTypes: ['MapCheckpoints'],
    endpoints: () => ({}),
})
