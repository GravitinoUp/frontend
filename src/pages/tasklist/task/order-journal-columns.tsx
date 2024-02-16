import { ColumnDef } from '@tanstack/react-table'
import i18next from 'i18next'
import OrderStatus from '@/components/order-status/order-status'
import { Checkbox } from '@/components/ui/checkbox'
import { FormattedOrderJournalInterface } from '@/types/interface/order-journal'

export const orderJournalColumns: ColumnDef<FormattedOrderJournalInterface>[] =
    [
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
            header: i18next.t('user.title'),
            accessorKey: 'user',
        },
        {
            header: i18next.t('action'),
            accessorKey: 'action',
        },
        {
            header: i18next.t('date.and.time'),
            accessorKey: 'date',
        },
        {
            header: i18next.t('status'),
            accessorKey: 'status',
            cell: ({ row }) => <OrderStatus status={row.original.status} />,
        },
    ]
