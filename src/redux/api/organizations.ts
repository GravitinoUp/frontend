import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    OrganizationInterface,
    OrganizationsPayloadInterface,
} from '@/types/interface/organizations'

const organizationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrganizations: builder.query<
            FetchDataInterface<OrganizationInterface[]>,
            OrganizationsPayloadInterface
        >({
            query: (body) => ({
                url: 'organization/all',
                method: 'POST',
                body,
            }),
            providesTags: ['Organizations'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllOrganizationsQuery } = organizationsApi
