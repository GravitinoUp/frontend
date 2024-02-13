import { EntityType, IQuery, SortOptionsType } from './fetch'

export interface PropertyPayloadInterface extends IQuery {
    filter: Partial<PropertyInterface>
    sorts: PropertySortInterface
}

export interface PropertyInterface {
    property_name_id: number
    property_name: string
    property_values: PropertyValueInterface[] | string[]
    entity_name: EntityType
}

export interface PropertyValueInterface {
    property_value_id: number
    property_name_id: number
    property_value: string
}

export type PropertySortInterface = Partial<
    Record<keyof PropertyInterface, SortOptionsType>
>
