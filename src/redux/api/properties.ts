import { api } from '.'
import { EntityType, FetchResultInterface } from '@/types/interface/fetch'
import {
    PropertyNameInterface,
    PropertyValueInterface,
    PropertyValuePayloadInterface,
} from '@/types/interface/properties'

const propertiesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPropertyNames: builder.query<
            PropertyNameInterface[],
            { entity_name: EntityType }
        >({
            query: (body) => ({
                url: 'property-names/all',
                method: 'GET',
                //body,
            }),
            providesTags: ['Properties'],
        }),
        getPropertyValues: builder.query<PropertyValueInterface[], void>({
            query: () => ({
                url: 'property-values/all',
                method: 'GET',
            }),
            providesTags: ['Properties'],
        }),
        createPropertyName: builder.mutation<
            FetchResultInterface<PropertyNameInterface>,
            Partial<Omit<PropertyNameInterface, 'property_name_id'>>
        >({
            query: (body) => ({
                url: `property-names`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Properties'],
        }),
        createPropertyValue: builder.mutation<
            FetchResultInterface<PropertyValueInterface>,
            Partial<Omit<PropertyValuePayloadInterface, 'property_value_id'>>
        >({
            query: (body) => ({
                url: `property-values`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Properties'],
        }),
        updatePropertyName: builder.mutation<
            PropertyNameInterface,
            Partial<PropertyNameInterface>
        >({
            query: (body) => ({
                url: `property-names`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Properties'],
        }),
        updatePropertyValue: builder.mutation<
            PropertyValueInterface,
            Partial<PropertyValueInterface>
        >({
            query: (body) => ({
                url: `property-values`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Properties'],
        }),
        deletePropertyName: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `property-names/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Properties'],
        }),
        deletePropertyValue: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `property-values/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Properties'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetPropertyNamesQuery,
    useCreatePropertyNameMutation,
    useCreatePropertyValueMutation,
    useUpdatePropertyNameMutation,
    useUpdatePropertyValueMutation,
    useDeletePropertyNameMutation,
    useDeletePropertyValueMutation,
} = propertiesApi
