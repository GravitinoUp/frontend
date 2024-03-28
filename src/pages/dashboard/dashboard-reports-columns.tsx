import { ColumnDef } from '@tanstack/react-table'
import i18next from '../../i18n.ts'
import CircularBar from '@/components/circular-bar/circular-bar.tsx'
import { QUALITY_STATUSES } from '@/constants/constants.ts'
import { cn } from '@/lib/utils.ts'
import { FormattedReportInterface } from '@/types/interface/report.ts'

export const dashboardReportsColumns: ColumnDef<FormattedReportInterface>[] = [
    {
        id: 'select',
        cell: ({ row }) => {
            const { completed_percent } = row.original

            return (
                <div
                    className={cn(
                        completed_percent >= QUALITY_STATUSES.HIGH
                            ? 'bg-[#49C96D]'
                            : completed_percent >= QUALITY_STATUSES.MEDIUM
                              ? 'bg-[#FFD240]'
                              : 'bg-[#FF6B6B]',
                        'w-[3px] rounded-full h-12'
                    )}
                />
            )
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
        header: `${i18next.t('checked.task.count')}, % `,
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
]
