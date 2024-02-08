import { api } from './'
import {
    CheckpointInterface,
    CheckpointsPayloadInterface,
} from '@/types/interface/checkpoint'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'

const checkpointsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCheckpoints: builder.query<
            CheckpointInterface[],
            CheckpointsPayloadInterface
        >({
            query: (body) => ({
                url: 'checkpoint/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<CheckpointInterface[]>
            ) => response.data,
            providesTags: ['Checkpoints'],
        }),
        deleteCheckpoint: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `checkpoint/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Checkpoints'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetCheckpointsQuery, useDeleteCheckpointMutation } =
    checkpointsApi
