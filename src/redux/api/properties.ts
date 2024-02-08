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
            { entity_name: EntityType }
        >({
            query: (body) => ({
                url: 'property/all',
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
        updateProperty: builder.mutation<
            PropertyInterface,
            Partial<PropertyPayloadInterface>
        >({
            query: (body) => ({
                url: `property`,
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
    useUpdatePropertyMutation,
    useUpdatePropertyValueMutation,
    useDeletePropertyNameMutation,
    useDeletePropertyValueMutation,
} = propertiesApi
