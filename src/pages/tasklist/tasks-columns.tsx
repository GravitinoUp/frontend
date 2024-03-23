import { ColumnDef } from '@tanstack/react-table'
import i18next from '../../i18n.ts'
import OrderStatus from '@/components/order-status/order-status.tsx'
import { Checkbox } from '@/components/ui/checkbox'
import { ActionButtons } from '@/pages/tasklist/components/action-buttons.tsx'
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
        header: i18next.t('number'),
        accessorKey: 'order_id',
    },
    {
        header: i18next.t('title'),
        accessorKey: 'order_name',
    },
    {
        header: i18next.t('facility.type'),
        accessorKey: 'facility_name',
    },
    {
        header: i18next.t('checkpoint'),
        accessorKey: 'checkpoint_name',
    },
    {
        header: i18next.t('branch'),
        accessorKey: 'branch_name',
    },
    {
        header: i18next.t('executor'),
        accessorKey: 'executor',
    },
    {
        header: i18next.t('task.creator'),
        accessorKey: 'creator',
    },
    {
        header: i18next.t('priority'),
        accessorKey: 'priority_name',
    },
    {
        header: i18next.t('type'),
        accessorKey: 'taskType',
        cell: ({ row }) => {
            const { taskType } = row.original
            return i18next.t(
                `task.${taskType === null ? 'unplanned' : 'planned'}`
            )
        },
    },
    {
        header: i18next.t('periodicity'),
        accessorKey: 'periodicity',
    },
    {
        header: i18next.t('delivery.date'),
        accessorKey: 'deliveryDate',
    },
    {
        header: i18next.t('close.date'),
        accessorKey: 'ended_at_datetime',
    },
    {
        header: i18next.t('task.description'),
        accessorKey: 'order_description',
    },
    {
        header: i18next.t('status'),
        accessorKey: 'order_status_name',
        cell: ({ row }) => (
            <OrderStatus status={row.original.order_status_name} />
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons task={row.original} />,
    },
]
