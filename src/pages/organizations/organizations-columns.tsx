import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import i18next from '../../i18n.ts'
import { Checkbox } from '@/components/ui/checkbox'
import { OrganizationInterface } from '@/types/interface/organizations'

export const organizationsColumns: ColumnDef<OrganizationInterface>[] = [
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
        accessorKey: 'short_name',
        header: i18next.t('title'),
    },
    {
        accessorKey: 'full_name',
        header: i18next.t('title.full'),
    },
    {
        accessorKey: 'register_number',
        header: i18next.t('registration.number'),
    },
    {
        accessorKey: 'phone',
        header: i18next.t('phone'),
    },
    {
        accessorKey: 'email',
        header: 'email',
    },
    {
        accessorKey: 'organization_type.organization_type_name',
        header: i18next.t('type'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons organization={row.original} />,
    },
]
