import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import { PeriodicityInterface } from '@/types/interface/orders.ts'

const periodicityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPeriodicity: builder.query<PeriodicityInterface[], void>({
            query: () => 'periodicity/all',
            transformResponse: (
                response: FetchDataInterface<PeriodicityInterface[]>
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPeriodicityQuery } = periodicityApi
