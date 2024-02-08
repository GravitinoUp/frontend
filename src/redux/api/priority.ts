import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import { PriorityInterface } from '@/types/interface/orders'

const priorityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPriority: builder.query<PriorityInterface[], unknown>({
            query: (body) => ({
                url: 'priority/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<PriorityInterface[]>
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPriorityQuery } = priorityApi
