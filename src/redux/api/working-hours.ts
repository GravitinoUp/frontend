import { api } from '.'
import { WorkingHoursInterface } from '@/types/interface/checkpoint'
import { FetchDataInterface } from '@/types/interface/fetch'

export const workingHoursApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllWorkingHoursQuery: builder.query<WorkingHoursInterface[], void>({
            query: () => ({
                url: 'working-hours/all',
                method: 'GET',
            }),
            transformResponse: (
                response: FetchDataInterface<WorkingHoursInterface[]>
            ) => response.data,
            providesTags: ['WorkingHours'],
        }),
    }),
})

export const { useGetAllWorkingHoursQueryQuery } = workingHoursApi
