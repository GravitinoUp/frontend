import { ColumnDef } from '@tanstack/react-table'
import i18next from '../../i18n.ts'
import { OrganizationInterface } from '@/types/interface/organizations'

export const organizationsColumns: ColumnDef<OrganizationInterface>[] = [
    {
        accessorKey: 'organization_id',
        header: i18next.t('number'),
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
        accessorKey: 'phone',
        header: i18next.t('phone'),
    },
    {
        accessorKey: 'organization_type.organization_type_name',
        header: i18next.t('type'),
    },
]
