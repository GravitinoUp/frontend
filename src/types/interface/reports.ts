import { BranchInterface } from './branch'
import { CheckpointInterface } from './checkpoint'
import { IQuery, SortOptionsType } from './fetch'
import { OrganizationInterface } from './organizations'
import { RecursivePartial } from '@/utils/recursive-partial'

// Branch

export interface BranchReportsPayloadInterface extends IQuery {
    filter: RecursivePartial<BranchReportInterface>
    sorts: BranchSortInterface
    period: {
        date_start: string
        date_end: string
    }
}

export interface BranchSortInterface extends ReportSortInterface {
    branch?: BranchSortInterface
}

export interface BranchReportInterface extends ReportInterface {
    branch: BranchInterface
}

// Checkpoint

export interface CheckpointReportsPayloadInterface extends IQuery {
    branch_id: number
    filter: RecursivePartial<CheckpointReportInterface>
    sorts: CheckpointSortInterface
    period: {
        date_start: string
        date_end: string
    }
}

export interface CheckpointSortInterface extends ReportSortInterface {
    checkpoint?: CheckpointSortInterface
}

export interface CheckpointReportInterface extends ReportInterface {
    checkpoint: CheckpointInterface
}

// Organization

export interface OrganizationReportsPayloadInterface extends IQuery {
    checkpoint_id: number
    filter: RecursivePartial<OrganizationReportInterface>
    sorts: OrganizationSortInterface
    period: {
        date_start: string
        date_end: string
    }
}

export interface OrganizationSortInterface extends ReportSortInterface {
    organization?: OrganizationReportInterface
}

export interface OrganizationReportInterface extends ReportInterface {
    organization: OrganizationInterface
}

type ReportSortInterface = Partial<
    Record<keyof ReportInterface, SortOptionsType>
>

export interface ReportInterface {
    all_count: number
    completed_count: number
    completed_percent: number
    checked_count: number
    checked_percent: number
}

export interface SavedReportInterface {
    report_id: number
    file_sku: string
    file_alt: string
    report_json: string
    createdAt: string
}
