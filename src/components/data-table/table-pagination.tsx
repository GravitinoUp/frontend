import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
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
    pagination: { itemCount: number; pageSize: number; pageIndex: number }
}

export function TablePagination<TData>({
    table,
    pagination,
}: TablePaginationProps<TData>) {
    const { t } = useTranslation()
    const totalPagesCount =
        typeof table?.getPageCount() !== 'undefined' &&
        Array.from({ length: table?.getPageCount() }, (_, i) => i)

    return (
        <div className="w-full flex items-center justify-between px-2 mt-6">
            <div className="w-full flex items-center justify-between space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Select
                        value={`${pagination.pageSize}`}
                        onValueChange={(value) => {
                            table?.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pagination.pageSize} />
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
                        variant="ghost"
                        className="hidden h-8 w-8 p-0 lg:flex bg-pagination text-primary"
                        onClick={() => table?.setPageIndex(0)}
                        disabled={!table?.getCanPreviousPage()}
                    >
                        <span className="sr-only">
                            {t('pagination.first.page')}
                        </span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-pagination text-primary"
                        onClick={() => table?.previousPage()}
                        disabled={!table?.getCanPreviousPage()}
                    >
                        <span className="sr-only">
                            {t('pagination.previous.page')}
                        </span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    {totalPagesCount &&
                        totalPagesCount.map((page) => {
                            const currentPage = pagination.pageIndex
                            const isCurrentPage = currentPage === page

                            const isVisible =
                                page === 0 || // First
                                page === totalPagesCount.length - 1 || // Last
                                (currentPage !== 0 &&
                                    page === currentPage - 1) || // Previous
                                page === currentPage || // Current
                                (currentPage !== totalPagesCount.length - 1 &&
                                    page === currentPage + 1) || // Next
                                (currentPage < 3 && page === currentPage + 2) ||
                                (currentPage < 2 && page === currentPage + 3) ||
                                (currentPage === 0 &&
                                    page === currentPage + 4) ||
                                (currentPage > totalPagesCount.length - 4 &&
                                    page === currentPage - 2) ||
                                (currentPage > totalPagesCount.length - 3 &&
                                    page === currentPage - 3) ||
                                (currentPage === totalPagesCount.length - 1 &&
                                    page === currentPage - 4)

                            const isDotVisible =
                                (currentPage < 3 && page === currentPage + 5) ||
                                page === currentPage - 2 ||
                                page === currentPage + 2 ||
                                (currentPage > totalPagesCount.length - 4 &&
                                    page === currentPage - 5)

                            return isVisible || totalPagesCount.length < 9 ? (
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
                            ) : (
                                isDotVisible && (
                                    <Button
                                        key={page}
                                        variant="ghost"
                                        className="h-8 w-8 p-0 font-normal"
                                    >
                                        ...
                                    </Button>
                                )
                            )
                        })}
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-pagination text-primary"
                        onClick={() => table?.nextPage()}
                        disabled={!table?.getCanNextPage()}
                    >
                        <span className="sr-only">
                            {t('pagination.next.page')}
                        </span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="hidden h-8 w-8 p-0 lg:flex bg-pagination text-primary"
                        onClick={() =>
                            table?.setPageIndex(table?.getPageCount() - 1)
                        }
                        disabled={!table?.getCanNextPage()}
                    >
                        <span className="sr-only">
                            {t('pagination.last.page')}
                        </span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
