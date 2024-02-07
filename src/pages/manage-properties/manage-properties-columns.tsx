import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import { Checkbox } from '@/components/ui/checkbox'
import { PropertyNameInterface } from '@/types/interface/properties'

export const managePropertiesColumns: ColumnDef<PropertyNameInterface>[] = [
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
        accessorKey: 'property_name',
        header: 'Название',
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons propertyName={row.original} />,
    },
]
