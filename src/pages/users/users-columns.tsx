import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import UserSwitch from './user-switch'
import i18next from '../../i18n.ts'
import { Checkbox } from '@/components/ui/checkbox'
import { FormattedUsersInterface } from '@/types/interface/user'

export const usersColumns: ColumnDef<FormattedUsersInterface>[] = [
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
        accessorKey: 'short_name',
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
