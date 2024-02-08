import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    OrderInterface,
    OrderMyPayloadInterface,
} from '@/types/interface/orders'

const ordersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<OrderInterface[], void>({
            query: () => 'order/all',
            transformResponse: (
                response: FetchDataInterface<OrderInterface[]>
            ) => response.data,
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
            transformResponse: (
                response: FetchDataInterface<OrderInterface[]>
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const { useGetOrdersQuery, useGetPersonalOrdersQuery } = ordersApi
