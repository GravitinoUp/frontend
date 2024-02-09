import { api } from '.'
import {
    EntityType,
    FetchDataInterface,
    FetchResultInterface,
} from '@/types/interface/fetch'
import {
    PropertyInterface,
    PropertyPayloadInterface,
    PropertyValueInterface,
    PropertyValuePayloadInterface,
} from '@/types/interface/properties'

const propertiesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProperties: builder.query<
            FetchDataInterface<PropertyInterface[]>,
            EntityType
        >({
            query: (entity_name) => ({
                url: `property/all/${entity_name}`,
                method: 'GET',
            }),
            providesTags: ['Properties'],
        }),
        createProperty: builder.mutation<
            FetchResultInterface<PropertyInterface>,
            Partial<Omit<PropertyPayloadInterface, 'property_name_id'>>
        >({
            query: (body) => ({
                url: `property`,
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
        deletePropertyName: builder.mutation<FetchResultInterface, number>({
            query: (id) => ({
                url: `property/${id}`,
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
    useGetPropertiesQuery,
    useCreatePropertyMutation,
    useCreatePropertyValueMutation,
    useDeletePropertyNameMutation,
    useDeletePropertyValueMutation,
} = propertiesApi
