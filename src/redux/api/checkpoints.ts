import { api } from './'
import { PermissionEnum } from '@/constants/permissions.enum'
import {
    CheckpointInterface,
    CheckpointPayloadInterface,
    CheckpointsPayloadInterface,
} from '@/types/interface/checkpoint'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import { formatQueryEndpoint } from '@/utils/helpers'

const checkpointsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCheckpoints: builder.query<
            FetchDataInterface<CheckpointInterface[]>,
            CheckpointsPayloadInterface
        >({
            query: (body) => ({
                url: `checkpoint/${formatQueryEndpoint(
                    PermissionEnum.CheckpointGet
                )}`,
                method: 'POST',
                body,
            }),
            providesTags: ['Checkpoints'],
        }),
        getCheckpointsByBranch: builder.query<
            CheckpointInterface[],
            { body: CheckpointsPayloadInterface; branchIDS: number[] }
        >({
            query: ({ body, branchIDS }) => {
                const queryParams = branchIDS
                    .map((id) => `branch_ids[]=${id}`)
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
        createCheckpoint: builder.mutation<
            FetchResultInterface,
            Omit<CheckpointPayloadInterface, 'checkpoint_id'>
        >({
            query: (body) => ({
                url: 'checkpoint',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Checkpoints'],
        }),
        updateCheckpoint: builder.mutation<
            FetchResultInterface,
            CheckpointPayloadInterface
        >({
            query: (body) => ({
                url: 'checkpoint',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Checkpoints'],
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
    useCreateCheckpointMutation,
    useUpdateCheckpointMutation,
    useDeleteCheckpointMutation,
} = checkpointsApi
