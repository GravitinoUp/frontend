import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import { PriorityInterface } from '@/types/interface/orders'

const priorityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPriority: builder.query<PriorityInterface[], void>({
            query: () => 'priority/all',
            transformResponse: (
                response: FetchDataInterface<PriorityInterface[]>,
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPriorityQuery } = priorityApi
