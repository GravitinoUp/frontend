import { ColumnDef } from '@tanstack/react-table'
import { ActionsDropdown } from './roles-actions'
import { Checkbox } from '@/components/ui/checkbox'
import { RoleInterface } from '@/types/interface/roles'

export const rolesTableColumns: ColumnDef<RoleInterface>[] = [
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
        accessorKey: 'role_name',
        header: 'Название',
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsDropdown role={row.original} />,
    },
]
