export interface FormattedReportInterface {
    key: number
    id: number
    name: string
    completed_percent: number
    completed_count: number
    checked_percent: number
    checked_count: number
}

export interface FormattedSavedReportInterface {
    key: number
    name: string
    creationDate: string
    size: string
}
