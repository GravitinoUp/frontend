import { EntityType } from './fetch'

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

export interface PropertyValuePayloadInterface {
    property_value_id: number
    property_name_id: number
    property_value: string
}
