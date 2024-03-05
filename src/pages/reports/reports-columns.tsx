import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons.tsx'
import i18next from '../../i18n.ts'
import CircularBar from '@/components/circular-bar/circular-bar.tsx'
import { Checkbox } from '@/components/ui/checkbox'
import { FormattedReportInterface } from '@/types/interface/report.ts'

export const reportsColumns: ColumnDef<FormattedReportInterface>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="bg-[#F8F8F8] border-[#E8E9EB]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="bg-[#F8F8F8] border-[#E8E9EB]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        header: `${i18next.t('checked.task.count')}, %`,
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
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons report={row.original} />,
    },
]
