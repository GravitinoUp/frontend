import { api } from '.'
import { PermissionEnum } from '@/constants/permissions.enum'
import { FetchDataInterface } from '@/types/interface/fetch'
import {
    BranchReportInterface,
    BranchReportsPayloadInterface,
    CheckpointReportInterface,
    CheckpointReportsPayloadInterface,
    OrganizationReportInterface,
    OrganizationReportsPayloadInterface,
} from '@/types/interface/reports'
import { formatQueryEndpoint } from '@/utils/helpers'

const checkpointsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBranchReports: builder.query<
            FetchDataInterface<BranchReportInterface[]>,
            BranchReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/branch/${formatQueryEndpoint(
                    PermissionEnum.ReportBranchCreate
                )}`,
                method: 'POST',
                body,
            }),
            providesTags: ['Reports'],
        }),
        getCheckpointReports: builder.query<
            FetchDataInterface<CheckpointReportInterface[]>,
            CheckpointReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/checkpoint?branch_id=${body.branch_id}`,
                method: 'POST',
                body,
            }),
            providesTags: ['Reports'],
        }),
        getOrganizationReports: builder.query<
            FetchDataInterface<OrganizationReportInterface[]>,
            OrganizationReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/organization?checkpoint_id=${body.checkpoint_id}`,
                method: 'POST',
                body,
            }),
            providesTags: ['Reports'],
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetBranchReportsQuery,
    useGetCheckpointReportsQuery,
    useGetOrganizationReportsQuery,
} = checkpointsApi
