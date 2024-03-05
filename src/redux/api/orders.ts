import { api } from './'
import { FetchDataInterface, FetchResultInterface } from '@/types/interface/fetch'
import {
    NewOrderBodyInterface,
    NewTaskBodyInterface,
    OrderInterface,
    OrderPayloadInterface,
    OrderUpdateInterface,
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
                response: FetchDataInterface<OrderInterface[]>,
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
            OrderInterface[] | undefined,
            NewOrderBodyInterface
        >({
            query: (body) => ({
                url: 'order',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchResultInterface<FetchDataInterface<OrderInterface[]>>,
            ) => response.data?.data,
            invalidatesTags: ['Orders'],
        }),
        updateOrder: builder.mutation<OrderInterface, OrderUpdateInterface>({
            query: (body) => ({
                url: 'order',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Orders'],
        }),
        addTask: builder.mutation<
            OrderInterface[] | undefined,
            NewTaskBodyInterface
        >({
            query: (body) => ({
                url: 'task',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchResultInterface<FetchDataInterface<OrderInterface[]>>,
            ) => response.data?.data,
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
            invalidatesTags: ['Orders', 'OrderJournal'],
        }),
        uploadFile: builder.mutation<unknown, { orderIDs: number[], directory: string, formData: FormData }>({
            query: ({ orderIDs, directory, formData }) => {
                const queryParams = orderIDs
                    .map((id) => `order_ids=${id}`)
                    .join('&')
                return {
                    url: `files/upload-images?${queryParams}&directory=${directory}`,
                    method: 'POST',
                    body: formData,
                }
            }
            ,
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetOrdersQuery,
    useGetPersonalOrdersQuery,
    useAddOrderMutation,
    useUpdateOrderMutation,
    useAddTaskMutation,
    useDeleteOrderMutation,
    useUpdateStatusMutation,
    useUploadFileMutation,
} = ordersApi
