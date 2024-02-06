import { api } from './'
import { PriorityInterface } from '@/types/interface/orders'

const priorityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPriority: builder.query<PriorityInterface[], unknown>({
            query: (body) => ({
                url: 'priority/all',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPriorityQuery } = priorityApi
