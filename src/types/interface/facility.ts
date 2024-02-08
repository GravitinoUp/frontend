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
