import { api } from '.'
import {
    BranchInterface,
    BranchesPayloadInterface,
} from '@/types/interface/branch'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'

const branchApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBranches: builder.query<BranchInterface[], BranchesPayloadInterface>(
            {
                query: (body) => ({
                    url: 'branch/all',
                    method: 'POST',
                    body,
                }),
                transformResponse: (
                    response: FetchDataInterface<BranchInterface[]>
                ) => response.data,
                providesTags: ['Branches'],
            }
        ),
        createBranch: builder.mutation<
            FetchResultInterface<BranchInterface>,
            Partial<Omit<BranchInterface, 'branch_id'>>
        >({
            query: (body) => ({
                url: `branch`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Branches'],
        }),
        updateBranch: builder.mutation<
            BranchInterface,
            Partial<BranchInterface>
        >({
            query: (body) => ({
                url: `branch`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Branches'],
        }),
        deleteBranch: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `branch/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Branches'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetBranchesQuery,
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation,
} = branchApi
