import { api } from '.'
import { OperatingModeInterface } from '@/types/interface/checkpoint'
import { FetchDataInterface } from '@/types/interface/fetch'

export const operatingModesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOperatingModes: builder.query<OperatingModeInterface[], void>({
            query: () => ({
                url: 'operating-mode/all',
                method: 'GET',
            }),
            transformResponse: (
                response: FetchDataInterface<OperatingModeInterface[]>
            ) => response.data,
            providesTags: ['OperatingMode'],
        }),
    }),
})

export const { useGetOperatingModesQuery } = operatingModesApi
