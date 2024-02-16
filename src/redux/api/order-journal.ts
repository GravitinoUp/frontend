import { api } from '.'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    OrderJournalInterface,
    OrderJournalPayloadInterface,
} from '@/types/interface/order-journal'

const orderJournalApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrderJournal: builder.query<
            FetchDataInterface<OrderJournalInterface[]>,
            OrderJournalPayloadInterface
        >({
            query: (body) => ({
                url: 'order-journal',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: true,
})

export const { useGetOrderJournalQuery } = orderJournalApi
