import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const ITEMS_PER_PAGE_LIST = [10, 20, 30, 40, 50]

interface TablePaginationProps<TData> {
    table?: Table<TData>
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
    const totalPagesCount =
        typeof table?.getPageCount() !== 'undefined' &&
        Array.from({ length: table?.getPageCount() }, (_, i) => i)

    return (
        <div className="w-full flex items-center justify-between px-2 mt-6">
            <div className="w-full flex items-center justify-between space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Select
                        value={`${table?.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table?.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    table?.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {ITEMS_PER_PAGE_LIST.map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex bg-[#E7F3FA] text-primary"
                        onClick={() => table?.setPageIndex(0)}
                        disabled={!table?.getCanPreviousPage()}
                    >
                        <span className="sr-only">На первую страницу</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-[#E7F3FA] text-primary"
                        onClick={() => table?.previousPage()}
                        disabled={!table?.getCanPreviousPage()}
                    >
                        <span className="sr-only">Предыдущая страница</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    {totalPagesCount &&
                        totalPagesCount.map((page) => {
                            const isCurrentPage =
                                table.getState().pagination.pageIndex === page
                            return (
                                <Button
                                    key={page}
                                    variant="ghost"
                                    className={`h-8 w-8 p-0 font-normal ${
                                        isCurrentPage
                                            ? 'bg-primary text-white'
                                            : ''
                                    }`}
                                    onClick={() => table?.setPageIndex(page)}
                                >
                                    {page + 1}
                                </Button>
                            )
                        })}
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-[#E7F3FA] text-primary"
                        onClick={() => table?.nextPage()}
                        disabled={!table?.getCanNextPage()}
                    >
                        <span className="sr-only">Следующая страница</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex bg-[#E7F3FA] text-primary"
                        onClick={() =>
                            table?.setPageIndex(table?.getPageCount() - 1)
                        }
                        disabled={!table?.getCanNextPage()}
                    >
                        <span className="sr-only">На последнюю страницу</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
