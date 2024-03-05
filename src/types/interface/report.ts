export interface FormattedReportInterface {
    key: number
    id: number
    name: string
    completedPercent: number
    completedCount: number
    checkedPercent: number
    checkedCount: number
}

export interface FormattedSavedReportInterface {
    key: number
    name: string
    creationDate: string
    size: string
}
