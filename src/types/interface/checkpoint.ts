import { RecursivePartial } from '@/utils/recursive-partial'
import { BranchInterface, BranchSortInterface } from './branch'
import { IQuery, SortOptionsType } from './fetch'
import { ReportInterface } from './reports'

export interface CheckpointsPayloadInterface extends IQuery {
    sorts: CheckpointSortInterface
    filter: RecursivePartial<CheckpointFilterInterface>
}

export interface CheckpointTypesPayloadInterface extends IQuery {
    sorts: CheckpointTypeSortInterface
    filter: Partial<CheckpointTypeInterface>
}

export interface FormattedCheckpointsInterface {
    checkpoint: CheckpointInterface
    key: number
    id: number
    checkpoint_name: string
    address: string
    branch_name: string
    working_hours?: string
    operating_mode?: string
    neighboring_state?: string
    region?: string | null
    checkpoint_type_name: string
}

// CHECKPOINT

export interface CheckpointPayloadInterface {
    checkpoint_id: number
    checkpoint_name: string
    address: string
    branch_id: string
    neighboring_state_id?: string
    district?: string
    region?: string
    checkpoint_type_id: string
    working_hours_id?: string
    operating_mode_id?: string
}

export interface CheckpointInterface {
    checkpoint_id: number
    checkpoint_name: string
    address: string
    lat: number
    lng: number
    branch: BranchInterface
    neighboring_state: NeighboringStateInterface
    district?: string | null
    region?: string | null
    checkpoint_type: CheckpointTypeInterface
    working_hours?: WorkingHoursInterface | null
    operating_mode?: OperatingModeInterface | null
    createdAt: Date
    updatedAt: Date
    property_values?: number[] | null
    report?: ReportInterface
}

export type CheckpointFilterInterface = Omit<CheckpointInterface, 'checkpoint_type'> & {
    checkpoint_type?: CheckpointTypeFilterInterface[]
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
export type CheckpointTypeFilterInterface = Omit<CheckpointTypeInterface, 'checkpoint_type_name'> & {
    checkpoint_type_name?: string
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