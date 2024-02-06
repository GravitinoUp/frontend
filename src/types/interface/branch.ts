import { IQuery, SortOptionsType } from './fetch'

export interface BranchesPayloadInterface extends IQuery {
    sorts: BranchSortInterface
    filter: Partial<BranchInterface>
}

// BRANCH

export interface BranchInterface {
    branch_id: number
    branch_name: string
    branch_address: string
}

export type BranchSortInterface = Partial<
    Record<keyof BranchInterface, SortOptionsType>
>
