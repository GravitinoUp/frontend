import { ColumnDef } from '@tanstack/react-table'
import i18next from '../../i18n.ts'
import CircularBar from '@/components/circular-bar/circular-bar.tsx'
import { QUALITY_STATUSES } from '@/constants/constants.ts'
import { FormattedReportInterface } from '@/types/interface/report.ts'

export const dashboardReportsColumns: ColumnDef<FormattedReportInterface>[] = [
    {
        id: 'select',
        cell: ({ row }) => {
            const { completedPercent } = row.original

            return <div className={`
                w-[3px]
                rounded-full
                h-12
                ${completedPercent >= QUALITY_STATUSES.HIGH ? 'bg-[#49C96D]' : completedPercent >= QUALITY_STATUSES.MEDIUM ? 'bg-[#FFD240]' : 'bg-[#FF6B6B]'}
            `} />
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: i18next.t('branch'),
        accessorKey: 'name',
    },
    {
        header: `${i18next.t('completed.task.count')}, % `,
        accessorKey: 'completedPercent',
        cell: ({ row }) => {
            const { completedPercent } = row.original

            return <CircularBar value={completedPercent} />
        },
    },
    {
        header: i18next.t('completed.task.count'),
        accessorKey: 'completedCount',
    },
    {
        header: `${i18next.t('checked.task.count')}, % `,
        accessorKey: 'checkedPercent',
        cell: ({ row }) => {
            const { checkedPercent } = row.original

            return <CircularBar value={checkedPercent} />
        },
    },
    {
        header: i18next.t('checked.task.count'),
        accessorKey: 'checkedCount',
    },
]
