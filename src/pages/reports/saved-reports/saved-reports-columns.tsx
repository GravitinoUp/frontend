import { ColumnDef } from '@tanstack/react-table'
import { ActionButtons } from './action-buttons.tsx'
import i18next from '../../../i18n.ts'
import FolderIcon from '@/assets/icons/folder.svg'
import { FormattedSavedReportInterface } from '@/types/interface/report.ts'

export const savedReportsColumns: ColumnDef<FormattedSavedReportInterface>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && 'indeterminate')
    //             }
    //             onCheckedChange={(value) =>
    //                 table.toggleAllPageRowsSelected(!!value)
    //             }
    //             aria-label="Select all"
    //             className="bg-[#F8F8F8] border-[#E8E9EB]"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //             className="bg-[#F8F8F8] border-[#E8E9EB]"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
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
