import { api } from './'
import { PermissionEnum } from '@/constants/permissions.enum'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    OrganizationInterface,
    OrganizationsPayloadInterface,
} from '@/types/interface/organizations'
import { formatQueryEndpoint } from '@/utils/helpers'

const organizationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrganizations: builder.query<
            FetchDataInterface<OrganizationInterface[]>,
            OrganizationsPayloadInterface
        >({
            query: (body) => ({
                url: `organization/${formatQueryEndpoint(
                    PermissionEnum.OrganizationGet
                )}`,
                method: 'POST',
                body,
            }),
            providesTags: ['Organizations'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllOrganizationsQuery } = organizationsApi
