import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import i18next from '../../i18n.ts'
import { BranchInterface } from '@/types/interface/branch'

export const branchesColumns: ColumnDef<BranchInterface>[] = [
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
