import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons.tsx'
import i18next from '../../i18n.ts'
import CircularBar from '@/components/circular-bar/circular-bar.tsx'
import { FormattedReportInterface } from '@/types/interface/report.ts'

export const reportsColumnsVisibility = {
    neighboring_state: false,
    facility_type: false,
}

export const reportsColumns: ColumnDef<FormattedReportInterface>[] = [
    {
        header: i18next.t('number'),
        accessorKey: 'id',
    },
    {
        header: i18next.t('title'),
        accessorKey: 'name',
    },
    {
        header: `${i18next.t('completed.task.count')}, %`,
        accessorKey: 'completed_percent',
        cell: ({ row }) => {
            const { completed_percent } = row.original

            return <CircularBar value={completed_percent} />
        },
    },
    {
        header: i18next.t('completed.task.count'),
        accessorKey: 'completed_count',
    },
    {
        header: `${i18next.t('checked.task.count')}, %`,
        accessorKey: 'checked_percent',
        cell: ({ row }) => {
            const { checked_percent } = row.original
            return <CircularBar value={checked_percent} />
        },
    },
    {
        header: i18next.t('checked.task.count'),
        accessorKey: 'checked_count',
    },
    {
        header: i18next.t('neighboring.state'),
        accessorKey: 'neighboring_state',
    },
    {
        header: i18next.t('facility'),
        accessorKey: 'facility_type',
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons rowData={row.original} />,
    },
]
