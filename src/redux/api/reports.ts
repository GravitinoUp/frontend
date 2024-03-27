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
    SavedReportInterface,
} from '@/types/interface/reports'
import {
    downloadFile,
    formatQueryEndpoint,
    getPermissionValue,
} from '@/utils/helpers'

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
        getSavedReports: builder.query<
            FetchDataInterface<SavedReportInterface[]>,
            void
        >({
            query: (body) => ({
                url: `report/all`,
                method: 'POST',
                body,
            }),
            providesTags: ['SavedReports'],
        }),
        saveBranchReports: builder.mutation<
            FetchDataInterface<BranchReportInterface[]>,
            BranchReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/branch/${formatQueryEndpoint(
                    PermissionEnum.ReportBranchCreate
                )}/save`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SavedReports'],
        }),
        saveCheckpointReports: builder.mutation<
            FetchDataInterface<CheckpointReportInterface[]>,
            CheckpointReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/checkpoint/save?branch_id=${body.branch_id}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SavedReports'],
        }),
        saveOrganizationReports: builder.mutation<
            FetchDataInterface<OrganizationReportInterface[]>,
            OrganizationReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/organization/save?checkpoint_id=${body.checkpoint_id}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SavedReports'],
        }),
        exportBranchReports: builder.mutation<
            void,
            BranchReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/branch/export${
                    !getPermissionValue([PermissionEnum.ReportBranchCreate]) &&
                    '-my'
                }`,
                method: 'POST',
                body,
                responseHandler: downloadFile,
            }),
        }),
        exportCheckpointReports: builder.mutation<
            void,
            CheckpointReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/checkpoint/export${
                    !getPermissionValue([
                        PermissionEnum.ReportCheckpointCreate,
                    ]) && '-my'
                }`,
                method: 'POST',
                body,
                responseHandler: downloadFile,
            }),
        }),
        exportOrganizationReports: builder.mutation<
            void,
            OrganizationReportsPayloadInterface
        >({
            query: (body) => ({
                url: `report/organization/export${
                    !getPermissionValue([
                        PermissionEnum.ReportOrganizationCreate,
                    ]) && '-my'
                }`,
                method: 'POST',
                body,
                responseHandler: downloadFile,
            }),
        }),
    }),
    overrideExisting: true,
})

export const {
    useGetBranchReportsQuery,
    useGetCheckpointReportsQuery,
    useGetOrganizationReportsQuery,
    useGetSavedReportsQuery,
    useSaveBranchReportsMutation,
    useSaveCheckpointReportsMutation,
    useSaveOrganizationReportsMutation,
    useExportBranchReportsMutation,
    useExportCheckpointReportsMutation,
    useExportOrganizationReportsMutation,
} = checkpointsApi
