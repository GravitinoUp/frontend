import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import { UserInterface, UsersPayloadInterface } from '@/types/interface/user'

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserInterface[], UsersPayloadInterface>({
            query: (body) => ({ url: 'users/all', method: 'POST', body }),
            transformResponse: (
                response: FetchDataInterface<UserInterface[]>
            ) => response.data,
        }),
    }),
    overrideExisting: true,
})

export const { useGetUsersQuery } = usersApi
