export interface IFetchState {
    error: string | null
    isLoading: boolean | null
}

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

export type SortOptionsType = 'ASC' | 'DESC' | null | undefined
