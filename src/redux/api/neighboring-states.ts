import { api } from '.'
import { NeighboringStateInterface } from '@/types/interface/checkpoint'
import { FetchDataInterface } from '@/types/interface/fetch'

export const neighboringStatesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNeighboringStates: builder.query<NeighboringStateInterface[], void>({
            query: () => ({
                url: 'neighboring-state/all',
                method: 'GET',
            }),
            transformResponse: (
                response: FetchDataInterface<NeighboringStateInterface[]>
            ) => response.data,
            providesTags: ['NeighboringStates'],
        }),
    }),
})

export const { useGetNeighboringStatesQuery } = neighboringStatesApi
