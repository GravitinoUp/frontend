import { api } from './'
import {
    OrderInterface,
    OrderMyPayloadInterface,
} from '@/types/interface/orders'

const ordersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<OrderInterface[], void>({
            query: () => 'order/all',
        }),
        getPersonalOrders: builder.query<
            OrderInterface[],
            OrderMyPayloadInterface
        >({
            query: (body) => ({
                url: 'order/my',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: true,
})

export const { useGetOrdersQuery, useGetPersonalOrdersQuery } = ordersApi
