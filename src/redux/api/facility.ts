import { api } from '.'
import {
    FacilityInterface,
    FacilityPayloadInterface,
} from '@/types/interface/facility'

const facilityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFacilities: builder.query<FacilityInterface[], unknown>({
            query: (body) => ({
                url: 'facility/all',
                method: 'POST',
                body,
            }),
        }),
        getFacilitiesByCheckpoint: builder.query<
            FacilityInterface[],
            { body: FacilityPayloadInterface; checkpointIDS: number[] }
        >({
            query: ({ body, checkpointIDS }) => {
                const queryParams = checkpointIDS
                    .map((id) => `checkpoint_ids=${id}`)
                    .join('&')
                return {
                    url: `facility/all-by-checkpoint?${queryParams}`,
                    method: 'POST',
                    body,
                }
            },
        }),
    }),
    overrideExisting: true,
})

export const { useGetFacilitiesQuery, useGetFacilitiesByCheckpointQuery } =
    facilityApi
