import { api } from '.'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    OrderStatusInterface,
    OrderStatusPayloadInterface,
} from '@/types/interface/orders'

const orderStatusesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrderStatuses: builder.query<OrderStatusInterface[], void>({
            query: () => 'order-status/all',
            transformResponse: (
                response: FetchDataInterface<OrderStatusInterface[]>
            ) => response.data,
            providesTags: ['OrderStatuses'],
        }),
        getOrderStatuses: builder.query<
            OrderStatusInterface[],
            OrderStatusPayloadInterface
        >({
            query: (body) => ({
                url: 'order-status/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<OrderStatusInterface[]>
            ) => response.data,
            providesTags: ['OrderStatuses'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllOrderStatusesQuery, useGetOrderStatusesQuery } =
    orderStatusesApi
