import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
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
        header: 'Название',
    },
    {
        accessorKey: 'full_name',
        header: 'Полное наименование',
    },
    {
        accessorKey: 'register_number',
        header: 'Номер регистрации',
    },
    {
        accessorKey: 'phone',
        header: 'Телефон',
    },
    {
        accessorKey: 'email',
        header: 'email',
    },
    {
        accessorKey: 'organization_type.organization_type_name',
        header: 'Тип',
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons organization={row.original} />,
    },
]
