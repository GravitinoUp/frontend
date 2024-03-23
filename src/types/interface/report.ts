export interface FormattedReportInterface {
    key: number
    id: number
    name: string
    completed_percent: number
    completed_count: number
    checked_percent: number
    checked_count: number
    neighboring_state?: string
    facility_type?: string
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
