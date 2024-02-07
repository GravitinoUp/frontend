import { ColumnDef } from '@tanstack/react-table'
import { z } from 'zod'
import { ActionButtons } from './action-button'
import CancelStatusTooltip from './cancel-status-tooltip'
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
        header: 'номер №.',
        accessorKey: 'id',
    },
    {
        header: 'Название',
        accessorKey: 'taskName',
    },
    {
        header: 'Объект обслуживания',
        accessorKey: 'facility',
    },
    {
        header: 'Пункт пропуска',
        accessorKey: 'checkpoint',
    },
    {
        header: 'Филиал',
        accessorKey: 'branch',
    },
    {
        header: 'Исполнитель',
        accessorKey: 'executor',
    },
    {
        header: 'Создатель задачи',
        accessorKey: 'taskCreator',
    },
    {
        header: 'Приоритет',
        accessorKey: 'priorityStatus',
    },
    {
        header: 'Тип',
        accessorKey: 'taskType',
        cell: ({ row }) => {
            const { taskType } = row.original
            return taskType === null ? 'Внеплановая' : 'Плановая'
        },
    },
    {
        header: 'Дата сдачи',
        accessorKey: 'deliveryDate',
    },
    {
        header: 'Дата закрытия',
        accessorKey: 'closeDate',
    },
    {
        header: 'Описание задачи',
        accessorKey: 'taskDescription',
    },
    {
        header: 'Статус',
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
