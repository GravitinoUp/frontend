import { useState } from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import { getCellAlignment, getCellTextColor } from './get-cell-class'
import { TablePagination } from './table-pagination'
import { DebouncedInput } from '../search-input'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import ArrowDown from '@/assets/icons/Arrod-down.svg'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    hasBackground?: boolean
    onRowClick?: (rowData: TData) => void
}

function DataTable<TData, TValue>({
    columns,
    data,
    hasBackground,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            globalFilter,
            rowSelection,
            sorting,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div
            className={`${
                hasBackground
                    ? 'bg-white rounded-2xl mt-4 p-6 flex flex-wrap gap-4 items-center justify-start w-full'
                    : ''
            }`}
        >
            <DebouncedInput
                value={globalFilter ?? ''}
                onChange={(value) => setGlobalFilter(String(value))}
            />
            <ScrollArea className="w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-[#8A9099] uppercase"
                                    >
                                        <div className="flex items-center">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                            {header.id !== 'select' &&
                                                header.id !== 'actions' && (
                                                    <Button
                                                        variant="ghost"
                                                        className={`py-0 px-1 ${
                                                            header.column.getIsSorted() ===
                                                            'asc'
                                                                ? 'rotate-180'
                                                                : 'rotate-0'
                                                        }`}
                                                        onClick={() =>
                                                            header.column.toggleSorting(
                                                                header.column.getIsSorted() ===
                                                                    'asc'
                                                            )
                                                        }
                                                    >
                                                        <ArrowDown />
                                                    </Button>
                                                )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    onClick={
                                        onRowClick !== undefined
                                            ? () => onRowClick!(row.original)
                                            : undefined
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`text-[15px] ${getCellTextColor(
                                                cell.column.id
                                            )} ${getCellAlignment(
                                                cell.column.id
                                            )}`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Ничего не найдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {table.getRowModel().rows?.length > 0 && (
                <TablePagination table={table} />
            )}
        </div>
    )
}

export default DataTable
