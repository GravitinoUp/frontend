import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons.tsx'
import i18next from '../../../i18n.ts'
import FolderIcon from '@/assets/icons/folder.svg'
import { FormattedSavedReportInterface } from '@/types/interface/report.ts'

export const savedReportsColumns: ColumnDef<FormattedSavedReportInterface>[] = [
    {
        id: 'select',
        cell: () => <FolderIcon />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: i18next.t('title'),
        accessorKey: 'name',
    },
    {
        header: i18next.t('creation.date'),
        accessorKey: 'creationDate',
    },
    {
        header: i18next.t('size'),
        accessorKey: 'size',
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionButtons savedReport={row.original} />,
    },
]
