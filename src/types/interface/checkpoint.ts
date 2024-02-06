import { BranchInterface, BranchSortInterface } from "./branch"
import { IQuery, SortOptionsType } from "./fetch"


export interface CheckpointsPayloadInterface extends IQuery {
    sorts: CheckpointSortInterface
    filter: Partial<CheckpointInterface>
}

export interface FormattedCheckpointsInterface {
    checkpoint:CheckpointInterface
    key: number
    id: number    
    checkpoint_name: string
    address:string
    branch_name: string
    working_hours?:string | null
    neighboring_state:string
    region:string
    checkpoint_type_name:string
}






// CHECKPOINT

export interface CheckpointInterface {
    checkpoint_id: number
    checkpoint_name: string
    address: string
    branch: BranchInterface
    neighboring_state: string
    district: string
    region: string
    checkpoint_type: CheckpointTypeInterface
    working_hours?: string | null
    operating_mode?: string | null
    createdAt?: Date
    updatedAt?: Date
    property_values?: number[] | null
}

export interface CheckpointSortInterface {
    checkpoint_id?: SortOptionsType
    checkpoint_name?: SortOptionsType
    checkpoint_type?: CheckpointTypeSortInterface | null
    address?: SortOptionsType
    branch?: BranchSortInterface | null
    neighboring_state?: SortOptionsType
    district?: SortOptionsType
    region?: SortOptionsType
    working_hours?: SortOptionsType
    operating_mode?: SortOptionsType
}

// CHECKPOINT TYPE

export interface CheckpointTypeInterface {
    checkpoint_type_id: number
    checkpoint_type_name: string
}

export type CheckpointTypeSortInterface = Partial<
    Record<keyof CheckpointTypeInterface, SortOptionsType>
>

