import { CheckpointInterface, CheckpointSortInterface } from './checkpoint'
import { IQuery, SortOptionsType } from './fetch'
import {
    OrganizationInterface,
    OrganizationSortInterface,
} from './organizations'

export interface FacilityInterface {
    facility_id: number
    facility_name: string
    organization: OrganizationInterface
    checkpoint: CheckpointInterface
    facility_type: FacilityType
    createdAt: Date
    updatedAt: Date
}

export interface FacilitySortInterface {
    facility_id?: SortOptionsType
    facility_name?: SortOptionsType
    organization?: OrganizationSortInterface
    checkpoint?: CheckpointSortInterface
}

export interface FacilityPayloadInterface extends IQuery {
    sorts: FacilitySortInterface
    filter: Partial<FacilityInterface>
}

export interface FacilityType {
    facility_type_id: number
    facility_type_name: string
}
