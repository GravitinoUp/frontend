import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import { Checkbox } from '@/components/ui/checkbox'
import { FormattedCheckpointsInterface } from '@/types/interface/checkpoint'

export const checkpointsColumns: ColumnDef<FormattedCheckpointsInterface>[] = [
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
        header: 'Номер №.',
        accessorKey: 'id',
    },
    {
        header: 'Название',
        accessorKey: 'checkpoint_name',
    },
    {
        header: 'Адрес',
        accessorKey: 'address',
    },
    {
        header: 'Филиал',
        accessorKey: 'branch_name',
    },
    {
        header: 'Режим работы',
        accessorKey: 'working_hours',
    },
    {
        header: 'Приграничное государство',
        accessorKey: 'neighboring_state',
    },
    {
        header: 'Регион',
        accessorKey: 'region',
    },
    {
        header: 'Тип',
        accessorKey: 'checkpoint_type_name',
    },

    {
        id: 'actions',
        cell: ({ row }) => (
            <ActionButtons checkpoint={row.original.checkpoint} />
        ),
    },
]
