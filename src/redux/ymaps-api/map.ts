import { ymapsApi } from '.'
import {
    CheckpointInterface,
    MapCheckpointInterface,
} from '@/types/interface/checkpoint'

const mapCheckpointsApi = ymapsApi.injectEndpoints({
    endpoints: (builder) => ({
        getMapCheckpoints: builder.query<
            MapCheckpointInterface[],
            CheckpointInterface[]
        >({
            query: (checkpoints) => {
                const mapCheckpoints: MapCheckpointInterface[] = []
                checkpoints.forEach((element, index) => {
                    mapCheckpoints.push({
                        ...element,
                        coordinates: [37.61556 + index, 55.75222],
                    })
                })
                return mapCheckpoints.toString()
                // return {
                //     url: `?apiKey=${
                //         import.meta.env.YMAPS_API_KEY
                //     }&geocode=${address}`,
                //     method: 'GET',
                // }
            },
            providesTags: ['MapCheckpoints'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetMapCheckpointsQuery } = mapCheckpointsApi
