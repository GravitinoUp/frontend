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
        getCheckpointsByBranch: builder.query<
            CheckpointInterface[],
            { body: CheckpointsPayloadInterface; branchIDS: number[] }
        >({
            query: ({ body, branchIDS }) => {
                const queryParams = branchIDS
                    .map((id) => `branch_ids=${id}`)
                    .join('&')
                return {
                    url: `checkpoint/all-by-branch?${queryParams}`,
                    method: 'POST',
                    body,
                }
            },
            transformResponse: (
                response: FetchDataInterface<CheckpointInterface[]>
            ) => response.data,
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

export const {
    useGetCheckpointsQuery,
    useGetCheckpointsByBranchQuery,
    useDeleteCheckpointMutation,
} = checkpointsApi
