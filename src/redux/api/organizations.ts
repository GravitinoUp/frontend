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
        getOrganizationsByCheckpoint: builder.query<
            OrganizationInterface[],
            {
                body: OrganizationsPayloadInterface
                checkpointIDs: number[]
                facilityTypeIDs: number[]
            }
        >({
            query: ({ body, checkpointIDs, facilityTypeIDs }) => {
                const queryParams = checkpointIDs
                    .map((id) => `checkpoint_ids[]=${id}`)
                    .join('&')
                const additionalQueryParams = facilityTypeIDs
                    .map((id) => `facility_type_ids[]=${id}`)
                    .join('&')
                return {
                    url: `organization/all-by-checkpoint?${queryParams}&${additionalQueryParams}`,
                    method: 'POST',
                    body,
                }
            },
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetAllOrganizationsQuery,
    useGetOrganizationsByCheckpointQuery,
} = organizationsApi
