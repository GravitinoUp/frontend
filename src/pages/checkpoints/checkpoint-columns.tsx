import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import i18next from '../../i18n.ts'
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
        header: i18next.t('number'),
        accessorKey: 'id',
    },
    {
        header: i18next.t('title'),
        accessorKey: 'checkpoint_name',
    },
    {
        header: i18next.t('address'),
        accessorKey: 'address',
    },
    {
        header: i18next.t('branch'),
        accessorKey: 'branch_name',
    },
    {
        header: i18next.t('working.hours'),
        accessorKey: 'working_hours',
    },
    {
        header: i18next.t('neighboring.state'),
        accessorKey: 'neighboring_state',
    },
    {
        header: i18next.t('region'),
        accessorKey: 'region',
    },
    {
        header: i18next.t('type'),
        accessorKey: 'checkpoint_type_name',
    },

    {
        id: 'actions',
        cell: ({ row }) => (
            <ActionButtons checkpoint={row.original.checkpoint} />
        ),
    },
]
