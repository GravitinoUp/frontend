import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import CancelStatusTooltip from './cancel-status-tooltip'
import { getStatusCellClass } from '@/components/data-table/get-cell-class'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TASK_STATUSES } from '@/constants/constants'
import { FormattedTaskInterface } from '@/types/interface/orders'

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
        cell: ({ row }) => {
            const id = row.original.id

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-[#8A9099]"
                        >
                            <span className="sr-only">Открыть меню</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log({ id })}>
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#FF6B6B]">
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
