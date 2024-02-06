import { SortOptionsType } from './fetch'

export interface GroupInterface {
    group_id: number
    group_name: string
    branch_id?: number | null
    checkpoint_id?: number | null
    facility_id?: number | null
}

export type GroupSortInterface = Partial<
    Record<keyof GroupInterface, SortOptionsType>
>
