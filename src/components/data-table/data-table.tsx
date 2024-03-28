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
import { cn } from '@/lib/utils.ts'

const SKELETON_ITEMS_COUNT = 10

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    hasBackground?: boolean
    onRowClick?: (rowData: TData) => void
    searchSuffixIconClick?: () => void
    searchPlaceholder?: string
    columnVisibility?: VisibilityState
    getTableInfo?: (
        pageSize: number,
        pageIndex: number,
        sorting: SortingState,
        filter?: string
    ) => void
    paginationInfo: { itemCount: number; pageSize: number; pageIndex: number }
    isLoading?: boolean
}

function DataTable<TData, TValue>({
    columns,
    data,
    hasBackground,
    onRowClick,
    searchSuffixIconClick,
    searchPlaceholder,
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
                          const isId = cell.column.id.includes('id')
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
            rowSelection,
        },
        initialState: {
            pagination: {
                pageIndex: paginationInfo.pageIndex,
                pageSize: paginationInfo.pageSize,
            },
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: Math.ceil(
            paginationInfo.itemCount / paginationInfo.pageSize
        ),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    useEffect(() => {
        getTableInfo(
            table.getState().pagination.pageSize,
            table.getState().pagination.pageIndex,
            table.getState().sorting,
            globalFilter !== '' ? globalFilter.trim() : undefined
        )
    }, [
        table.getState().pagination.pageSize,
        table.getState().pagination.pageIndex,
    ])

    useEffect(() => {
        getTableInfo(
            table.getState().pagination.pageSize,
            0,
            table.getState().sorting,
            globalFilter !== '' ? globalFilter.trim() : undefined
        )
    }, [table.getState().sorting, globalFilter])

    return (
        <div
            className={cn(
                hasBackground &&
                    'bg-white rounded-2xl mt-4 p-6 flex flex-wrap gap-4 items-center justify-start w-full'
            )}
        >
            <DebouncedInput
                value={globalFilter ?? ''}
                placeholder={searchPlaceholder}
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
                                                        className={cn(
                                                            'py-0 px-1',
                                                            header.column.getIsSorted() ===
                                                                'asc'
                                                                ? 'rotate-180'
                                                                : 'rotate-0'
                                                        )}
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
                                    onClick={(e) => {
                                        const clickedColumnId = (
                                            e.target as HTMLTableRowElement
                                        ).getAttribute('data-column-id')
                                        if (
                                            typeof onRowClick !== 'undefined' &&
                                            clickedColumnId !== null &&
                                            !isLoading
                                        ) {
                                            onRowClick(row.original)
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'text-[15px]',
                                                getCellTextColor(
                                                    cell.column.id
                                                ),
                                                getCellAlignment(cell.column.id)
                                            )}
                                            data-column-id={cell.column.id}
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
                <TablePagination table={table} pagination={paginationInfo} />
            )}
        </div>
    )
}

export default DataTable
