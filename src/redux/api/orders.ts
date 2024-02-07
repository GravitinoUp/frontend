import { api } from './'
import { FetchResultInterface } from '@/types/interface/fetch'
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
            providesTags: ['Orders'],
        }),
        addOrder: builder.mutation<
            FetchResultInterface<OrderInterface>,
            unknown
        >({
            query: (body) => ({
                url: 'order',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Orders'],
        }),
        deleteOrder: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `order/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetOrdersQuery,
    useGetPersonalOrdersQuery,
    useAddOrderMutation,
    useDeleteOrderMutation,
} = ordersApi
