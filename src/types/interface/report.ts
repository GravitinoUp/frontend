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

export interface ReportFilterInterface {
    min_completed_count: number
    max_completed_count: number
    min_completed_percent: number
    max_completed_percent: number
    min_checked_count: number
    max_checked_count: number
    min_checked_percent: number
    max_checked_percent: number
}
