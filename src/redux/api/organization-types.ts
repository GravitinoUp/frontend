import { api } from '.'
import {
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import {
    OrganizationTypeInterface,
    OrganizationTypePayloadInterface,
} from '@/types/interface/organizations'

const organizationTypesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrganizationTypes: builder.query<
            OrganizationTypeInterface[],
            OrganizationTypePayloadInterface
        >({
            query: (body) => ({
                url: 'organization-type/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<OrganizationTypeInterface[]>
            ) => response.data,
            providesTags: ['OrganizationTypes'],
        }),
        createOrganizationType: builder.mutation<
            FetchResultInterface<OrganizationTypeInterface>,
            Partial<OrganizationTypeInterface>
        >({
            query: (body) => ({
                url: `organization-type`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['OrganizationTypes'],
        }),
        updateOrganizationType: builder.mutation<
            { success: boolean },
            Partial<OrganizationTypeInterface>
        >({
            query: (body) => ({
                url: `organization-type`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['OrganizationTypes'],
        }),
        deleteOrganizationType: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `organization-type/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['OrganizationTypes'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetAllOrganizationTypesQuery,
    useCreateOrganizationTypeMutation,
    useUpdateOrganizationTypeMutation,
    useDeleteOrganizationTypeMutation,
} = organizationTypesApi
