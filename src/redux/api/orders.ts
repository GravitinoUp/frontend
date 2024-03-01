import { api } from './'
import { NewOrderBodyInterface } from '@/pages/tasklist/constants'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import {
    OrderInterface,
    OrderPayloadInterface,
    UpdateStatusPayloadInterface,
} from '@/types/interface/orders'

const ordersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<OrderInterface[], OrderPayloadInterface>({
            query: (body) => ({
                url: 'order/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<OrderInterface[]>
            ) => response.data,
            providesTags: ['Orders'],
        }),
        getPersonalOrders: builder.query<
            FetchDataInterface<OrderInterface[]>,
            OrderPayloadInterface
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
        updateStatus: builder.mutation<
            FetchResultInterface,
            UpdateStatusPayloadInterface
        >({
            query: (body) => ({
                url: 'order/update-status',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Orders', 'OrderJournal', 'OrderStatuses'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetOrdersQuery,
    useGetPersonalOrdersQuery,
    useAddOrderMutation,
    useDeleteOrderMutation,
    useUpdateStatusMutation,
} = ordersApi
