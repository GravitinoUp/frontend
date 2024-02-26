import { api } from '.'
import {
    CheckpointTypeInterface,
    CheckpointTypesPayloadInterface,
} from '@/types/interface/checkpoint'
import { FetchDataInterface } from '@/types/interface/fetch'

const checkpointTypesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllCheckpointTypes: builder.query<
            CheckpointTypeInterface[],
            CheckpointTypesPayloadInterface
        >({
            query: (body) => ({
                url: 'checkpoint-type/all',
                method: 'POST',
                body,
            }),
            transformResponse: (
                response: FetchDataInterface<CheckpointTypeInterface[]>
            ) => response.data,
            providesTags: ['CheckpointTypes'],
        }),
    }),
    overrideExisting: true,
})

export const { useGetAllCheckpointTypesQuery } = checkpointTypesApi
