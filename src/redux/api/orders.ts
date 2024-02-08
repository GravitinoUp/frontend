import { api } from './'
import { NewOrderBodyInterface } from '@/pages/tasklist/constants'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
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
            providesTags: ['Orders'],
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
            providesTags: ['Orders'],
        }),
        addOrder: builder.mutation<
            FetchResultInterface<OrderInterface>,
            NewOrderBodyInterface
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
