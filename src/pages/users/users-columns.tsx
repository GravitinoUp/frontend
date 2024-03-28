import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import UserSwitch from './user-switch'
import i18next from '../../i18n.ts'
import { FormattedUsersInterface } from '@/types/interface/user'

export const usersColumns: ColumnDef<FormattedUsersInterface>[] = [
    {
        header: i18next.t('number'),
        accessorKey: 'user_id',
    },
    {
        header: i18next.t('full.name'),
        accessorKey: 'FIO',
    },
    {
        header: i18next.t('phone'),
        accessorKey: 'phone',
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: i18next.t('company'),
        accessorKey: 'organization_name',
    },
    {
        header: i18next.t('type'),
        accessorKey: 'organization_type_name',
    },
    {
        header: i18next.t('role'),
        accessorKey: 'role_name',
    },
    {
        header: i18next.t('status'),
        accessorKey: 'is_active',
        cell: ({ row }) => <UserSwitch user={row.original.user} />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons user={row.original.user} />,
    },
]
