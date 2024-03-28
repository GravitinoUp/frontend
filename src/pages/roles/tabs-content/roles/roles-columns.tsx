import { ColumnDef } from '@tanstack/react-table'
import { ActionsDropdown } from './action-buttons.tsx'
import i18next from '../../../../i18n.ts'
import { RoleInterface } from '@/types/interface/roles'

export const rolesTableColumns: ColumnDef<RoleInterface>[] = [
    {
        accessorKey: 'role_name',
        header: i18next.t('title'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsDropdown role={row.original} />,
    },
]
