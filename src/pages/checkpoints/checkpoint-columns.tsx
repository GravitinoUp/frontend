import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons'
import i18next from '../../i18n.ts'
import { FormattedCheckpointsInterface } from '@/types/interface/checkpoint'

export const checkpointsColumns: ColumnDef<FormattedCheckpointsInterface>[] = [
    {
        header: i18next.t('number'),
        accessorKey: 'checkpoint_id',
    },
    {
        header: i18next.t('title'),
        accessorKey: 'checkpoint_name',
    },
    {
        header: i18next.t('address'),
        accessorKey: 'address',
    },
    {
        header: i18next.t('branch'),
        accessorKey: 'branch_name',
    },
    {
        header: i18next.t('working.hours'),
        accessorKey: 'working_hours_name',
    },
    {
        header: i18next.t('operating.mode'),
        accessorKey: 'operating_mode_name',
    },
    {
        header: i18next.t('neighboring.state'),
        accessorKey: 'neighboring_state_name',
    },
    {
        header: i18next.t('region'),
        accessorKey: 'region',
    },
    {
        header: i18next.t('type'),
        accessorKey: 'checkpoint_type_name',
    },

    {
        id: 'actions',
        cell: ({ row }) => (
            <ActionButtons checkpoint={row.original.checkpoint} />
        ),
    },
]
