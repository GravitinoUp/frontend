import { BranchInterface } from './branch'
import { CheckpointInterface } from './checkpoint'
import { IQuery, SortOptionsType } from './fetch'
import { OrganizationInterface } from './organizations'

// Branch

export interface BranchReportsPayloadInterface extends IQuery {
    filter: Partial<BranchReportInterface>
    sorts: BranchSortInterface
    period: {
        period_start: string
        period_end: string
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
    filter: Partial<CheckpointReportInterface>
    sorts: CheckpointSortInterface
    period: {
        period_start: string
        period_end: string
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
    filter: Partial<OrganizationReportInterface>
    sorts: OrganizationSortInterface
    period: {
        period_start: string
        period_end: string
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

interface ReportInterface {
    all_count: number
    completed_count: number
    completed_percent: number
    checked_count: number
    checked_percent: number
}
