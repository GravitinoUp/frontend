import { api } from '.'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import { GroupInterface } from '@/types/interface/group'

export const groupsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getGroups: builder.query<FetchDataInterface<GroupInterface[]>, void>({
            query: () => ({
                url: 'group/all',
                method: 'GET',
            }),
            providesTags: ['Groups'],
        }),
        addGroup: builder.mutation<
            FetchResultInterface<GroupInterface>,
            Partial<GroupInterface>
        >({
            query: (body) => ({
                url: 'group',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Groups'],
        }),
        updateGroup: builder.mutation<GroupInterface, Partial<GroupInterface>>({
            query: (body) => ({
                url: 'group',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Groups'],
        }),
        deleteGroup: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `group/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Groups'],
        }),
    }),
})

export const {
    useGetGroupsQuery,
    useAddGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
} = groupsApi
