import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import i18next from '../../i18n.ts'
import { Checkbox } from '@/components/ui/checkbox'
import { BranchInterface } from '@/types/interface/branch'

export const branchesColumns: ColumnDef<BranchInterface>[] = [
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
        accessorKey: 'branch_id',
    },
    {
        accessorKey: 'branch_name',
        header: i18next.t('title'),
    },
    {
        accessorKey: 'branch_address',
        header: i18next.t('address'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons branch={row.original} />,
    },
]
