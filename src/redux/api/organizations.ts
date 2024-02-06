import { api } from './'
import { FetchResultInterface } from '@/types/interface/fetch'
import {
    OrganizationInterface,
    OrganizationsPayloadInterface,
} from '@/types/interface/organizations'

const organizationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrganizations: builder.query<
            OrganizationInterface[],
            OrganizationsPayloadInterface
        >({
            query: (body) => ({
                url: 'organization/all',
                method: 'POST',
                body,
            }),
            providesTags: ['Organizations'],
        }),
        createOrganization: builder.mutation<
            FetchResultInterface<OrganizationInterface>,
            Partial<OrganizationInterface>
        >({
            query: (body) => ({
                url: `organization`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Organizations'],
        }),
        updateOrganization: builder.mutation<
            { success: boolean },
            Partial<OrganizationInterface>
        >({
            query: (body) => ({
                url: `organization`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Organizations'],
        }),
        deleteOrganization: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `organization/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Organizations'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetAllOrganizationsQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
} = organizationsApi
