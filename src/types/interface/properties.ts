export interface PropertyPayloadInterface {
    property_name_id: number
    property_name: string
    property_values: string[]
    entity_name: string
}

export interface PropertyNameInterface {
    property_name_id: number
    property_name: string
    entity_name: string
}

export interface PropertyValueInterface {
    property_value_id: number
    property_name: PropertyNameInterface
    property_value: string
}

export interface PropertyValuePayloadInterface {
    property_value_id: number
    property_name_id: number
    property_value: string
}
