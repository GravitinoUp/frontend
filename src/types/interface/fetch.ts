export interface IQuery {
    offset: IOffset
}

export interface IOffset {
    count: number
    page: number
}

export interface FetchResultInterface<T = void> {
    status: boolean
    data?: T
}

export interface FetchDataInterface<T> {
    count: number
    data: T
}

export interface ErrorInterface {
    text: string
    url: string
    method: string
    error: string
    statusCode: number
}

export type SortOptionsType = 'ASC' | 'DESC' | null | undefined

export type EntityType =
    | 'Users'
    | 'Tasks'
    | 'Reports'
    | 'Organizations'
    | 'Checkpoints'
    | 'Branches'
    | 'Roles'
