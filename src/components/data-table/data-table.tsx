import { useEffect, useMemo, useState } from 'react'
import {
    Cell,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'

import { useTranslation } from 'react-i18next'
import { getCellAlignment, getCellTextColor } from './get-cell-class'
import { TablePagination } from './table-pagination'
import { DebouncedInput } from '../search-input'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import ArrowDown from '@/assets/icons/Arrod-down.svg'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const SKELETON_ITEMS_COUNT = 5

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    hasBackground?: boolean
    onRowClick?: (rowData: TData) => void
    searchSuffixIconClick?: () => void
    columnVisibility?: VisibilityState
    getTableInfo?: (
        pageSize: number,
        pageIndex: number,
        sorting: SortingState
    ) => void
    paginationInfo: { itemCount: number; pageSize: number }
    isLoading?: boolean
}

function DataTable<TData, TValue>({
    columns,
    data,
    hasBackground,
    onRowClick,
    searchSuffixIconClick,
    columnVisibility = {},
    getTableInfo: getTableInfo = () => {},
    paginationInfo,
    isLoading,
}: DataTableProps<TData, TValue>) {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const tableData = useMemo(
        () => (isLoading ? Array(SKELETON_ITEMS_COUNT).fill({}) : data),
        [isLoading, data]
    )
    const tableColumns = useMemo(
        () =>
            isLoading
                ? columns.map((column) => ({
                      ...column,
                      cell: ({ cell }: { cell: Cell<unknown, unknown> }) => {
                          const isActions = cell.column.id === 'actions'
                          const isId = cell.column.id === 'id'
                          const isSelect = cell.column.id === 'select'
                          if (isActions || isId) {
                              return <Skeleton className="h-6 w-6" />
                          }

                          return (
                              <Skeleton
                                  className={
                                      isSelect ? 'h-4 w-4' : 'h-6 w-[100px]'
                                  }
                              />
                          )
                      },
                  }))
                : columns,
        [isLoading, columns]
    )
    const table = useReactTable({
        data: tableData,
        columns: tableColumns,
        state: {
            columnFilters,
            columnVisibility,
            globalFilter,
            rowSelection,
        },
        manualPagination: true,
        manualSorting: true,
        pageCount: Math.ceil(
            paginationInfo.itemCount / paginationInfo.pageSize
        ),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    useEffect(() => {
        getTableInfo(
            table.getState().pagination.pageSize,
            table.getState().pagination.pageIndex,
            table.getState().sorting
        )
    }, [
        table.getState().pagination.pageSize,
        table.getState().pagination.pageIndex,
        table.getState().sorting,
    ])

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
                suffixIconClick={searchSuffixIconClick}
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
                                    onDoubleClick={
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
                                    {t('nothing.found')}
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
