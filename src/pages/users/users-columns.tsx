import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import UserSwitch from './user-switch'
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
        header: 'номер №.',
        accessorKey: 'id',
    },
    {
        header: 'ФИО',
        accessorKey: 'FIO',
    },
    {
        header: 'Телефон',
        accessorKey: 'phone',
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: 'Компания',
        accessorKey: 'company',
    },
    {
        header: 'Тип',
        accessorKey: 'type',
    },
    {
        header: 'Роль',
        accessorKey: 'role',
    },
    {
        header: 'Статус',
        accessorKey: 'is_active',
        cell: ({ row }) => <UserSwitch user={row.original.user} />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons user={row.original.user} />,
    },
]
