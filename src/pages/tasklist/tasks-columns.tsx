import { ColumnDef } from '@tanstack/react-table'
import { z } from 'zod'
import { ActionButtons } from './action-buttons'
import CancelStatusTooltip from './cancel-status-tooltip'
import i18next from '../../i18n.ts'
import { getStatusCellClass } from '@/components/data-table/get-cell-class'
import { Checkbox } from '@/components/ui/checkbox'
import { TASK_STATUSES } from '@/constants/constants'
import { FormattedTaskInterface } from '@/types/interface/orders'

export const tasksColumnsSchema = z.object({
    key: z.boolean().default(true).optional(),
    id: z.boolean().default(true).optional(),
    checkpoint: z.boolean().default(true).optional(),
    taskDescription: z.boolean().default(true).optional(),
    status: z.boolean().default(true).optional(),
    taskName: z.boolean().default(true).optional(),
    priorityStatus: z.boolean().default(true).optional(),
    executor: z.boolean().default(true).optional(),
    facility: z.boolean().default(true).optional(),
    branch: z.boolean().default(true).optional(),
    deliveryDate: z.boolean().default(true).optional(),
})

export type TasksFilterColumns = z.infer<typeof tasksColumnsSchema>

export const tasksColumns: ColumnDef<FormattedTaskInterface>[] = [
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
        accessorKey: 'taskName',
    },
    {
        header: i18next.t('facility'),
        accessorKey: 'facility',
    },
    {
        header: i18next.t('checkpoint'),
        accessorKey: 'checkpoint',
    },
    {
        header: i18next.t('branch'),
        accessorKey: 'branch',
    },
    {
        header: i18next.t('executor'),
        accessorKey: 'executor',
    },
    {
        header: i18next.t('task.creator'),
        accessorKey: 'taskCreator',
    },
    {
        header: i18next.t('priority'),
        accessorKey: 'priorityStatus',
    },
    {
        header: i18next.t('type'),
        accessorKey: 'taskType',
        cell: ({ row }) => {
            const { taskType } = row.original
            return i18next.t(`task.${taskType === null ? 'unplanned' : 'planned'}`)
        },
    },
    {
        header: i18next.t('delivery.date'),
        accessorKey: 'deliveryDate',
    },
    {
        header: i18next.t('close.date'),
        accessorKey: 'closeDate',
    },
    {
        header: i18next.t('task.description'),
        accessorKey: 'taskDescription',
    },
    {
        header: i18next.t('status'),
        accessorKey: 'status',
        cell: ({ row }) => {
            const { status } = row.original
            const className = getStatusCellClass(status)
            const isWorkNeeded =
                status.toLowerCase() === TASK_STATUSES.NEED_WORK

            return (
                <div className="flex items-center ">
                    {isWorkNeeded && <CancelStatusTooltip />}
                    <span className={className}>{status}</span>
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons task={row.original} />,
    },
]
