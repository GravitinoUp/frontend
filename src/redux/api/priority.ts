import { api } from './'
import { PriorityInterface } from '@/types/interface/orders'

const priorityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPriority: builder.query<PriorityInterface[], void>({
            query: () => 'priority/all',
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllPriorityQuery } = priorityApi
