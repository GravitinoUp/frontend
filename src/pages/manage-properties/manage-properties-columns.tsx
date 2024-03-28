import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import i18next from '../../i18n.ts'
import { PropertyInterface } from '@/types/interface/properties'

export const managePropertiesColumns: ColumnDef<PropertyInterface>[] = [
    {
        accessorKey: 'property_name',
        header: i18next.t('title'),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons property={row.original} />,
    },
]
