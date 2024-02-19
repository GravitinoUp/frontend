import { BranchInterface, BranchSortInterface } from './branch'
import { IQuery, SortOptionsType } from './fetch'

export interface CheckpointsPayloadInterface extends IQuery {
    sorts: CheckpointSortInterface
    filter: Partial<CheckpointInterface>
}

export interface FormattedCheckpointsInterface {
    checkpoint: CheckpointInterface
    key: number
    id: number
    checkpoint_name: string
    address: string
    branch_name: string
    working_hours?: string
    neighboring_state?: string
    region?: string | null
    checkpoint_type_name: string
}

// CHECKPOINT

export interface CheckpointInterface {
    checkpoint_id: number
    checkpoint_name: string
    address: string
    lat: number
    lng: number
    branch: BranchInterface
    neighboring_state?: NeighboringStateInterface | null
    district?: string | null
    region?: string | null
    checkpoint_type: CheckpointTypeInterface
    working_hours?: WorkingHoursInterface | null
    operating_mode?: OperatingModeInterface | null
    createdAt: Date
    updatedAt: Date
    property_values?: number[] | null
}

export interface CheckpointSortInterface {
    checkpoint_id?: SortOptionsType
    checkpoint_name?: SortOptionsType
    checkpoint_type?: CheckpointTypeSortInterface | null
    address?: SortOptionsType
    branch?: BranchSortInterface | null
    neighboring_state?: NeighboringStateSortInterface | null
    district?: SortOptionsType
    region?: SortOptionsType
    working_hours?: WorkingHoursSortInterface | null
    operating_mode?: OperatingModeSortInterface | null
}

// CHECKPOINT TYPE

export interface CheckpointTypeInterface {
    checkpoint_type_id: number
    checkpoint_type_name: string
}

export type CheckpointTypeSortInterface = Partial<
    Record<keyof CheckpointTypeInterface, SortOptionsType>
>

// NEIGHBORING STATE

export interface NeighboringStateInterface {
    neighboring_state_id: number
    neighboring_state_name: string
}

export type NeighboringStateSortInterface = Partial<
    Record<keyof NeighboringStateInterface, SortOptionsType>
>

// WORKING HOURS

export interface WorkingHoursInterface {
    working_hours_id: number
    working_hours_name: string
}

export type WorkingHoursSortInterface = Partial<
    Record<keyof WorkingHoursInterface, SortOptionsType>
>

// OPERATING MODE

export interface OperatingModeInterface {
    operating_mode_id: number
    operating_mode_name: string
}

export type OperatingModeSortInterface = Partial<
    Record<keyof OperatingModeInterface, SortOptionsType>
>
