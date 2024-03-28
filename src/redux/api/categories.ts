import { api } from './'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    CategoryInterface,
    CategoryPayloadInterface,
} from '@/types/interface/orders.ts'

const categoriesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<
            FetchDataInterface<CategoryInterface[]>,
            CategoryPayloadInterface
        >({
            query: (body) => ({ url: 'category/all', method: 'POST', body }),
        }),
    }),
    overrideExisting: true,
})

export const { useGetCategoriesQuery } = categoriesApi
