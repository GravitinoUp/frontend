import { api } from '.'
import { PermissionEnum } from '@/constants/permissions.enum'
import {
    FacilityInterface,
    FacilityPayloadInterface,
    FacilityType,
} from '@/types/interface/facility'
import { FetchDataInterface } from '@/types/interface/fetch'
import { formatQueryEndpoint } from '@/utils/helpers'

const facilityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFacilities: builder.query<FacilityInterface[], unknown>({
            query: (body) => ({
                url: `facility/${formatQueryEndpoint(
                    PermissionEnum.FacilityGet
                )}`,
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<FacilityInterface[]>
            ) => response.data,
        }),
        getFacilitiesByCheckpoint: builder.query<
            FacilityInterface[],
            { body: FacilityPayloadInterface; checkpointIDS: number[] }
        >({
            query: ({ body, checkpointIDS }) => {
                const queryParams = checkpointIDS
                    .map((id) => `checkpoint_ids[]=${id}`)
                    .join('&')
                return {
                    url: `facility/all-by-checkpoint?${queryParams}`,
                    method: 'POST',
                    body,
                }
            },
            transformResponse: (
                response: FetchDataInterface<FacilityInterface[]>
            ) => response.data,
        }),
        getFacilityTypes: builder.query<FacilityType[], void>({
            query: () => 'facility-type/all',
            transformResponse: (response: FetchDataInterface<FacilityType[]>) =>
                response.data,
        }),
        getFacilitiesByType: builder.query<
            FacilityInterface[],
            { body: FacilityPayloadInterface; facilityTypeIDs: number[] }
        >({
            query: ({ body, facilityTypeIDs }) => {
                const queryParams = facilityTypeIDs
                    .map((id) => `type_ids[]=${id}`)
                    .join('&')
                return {
                    url: `facility/all-by-type?${queryParams}`,
                    method: 'POST',
                    body,
                }
            },
            transformResponse: (
                response: FetchDataInterface<FacilityInterface[]>
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetFacilitiesQuery,
    useGetFacilitiesByCheckpointQuery,
    useGetFacilityTypesQuery,
    useGetFacilitiesByTypeQuery,
} = facilityApi
