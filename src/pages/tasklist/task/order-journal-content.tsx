import { useState } from 'react'
import { orderJournalColumns } from './order-journal-columns'
import { placeholderQuery } from '../constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { useGetOrderJournalQuery } from '@/redux/api/order-journal'
import { OrderJournalPayloadInterface } from '@/types/interface/order-journal'
import { formatDate } from '@/utils/helpers'

interface OrderJournalContentProps {
    order_id: number
}

function OrderJournalContent({ order_id }: OrderJournalContentProps) {
    const [orderJournalQuery, setOrderJournalQuery] =
        useState<OrderJournalPayloadInterface>({
            ...placeholderQuery,
            filter: {
                order_id: order_id,
            },
        })

    const {
        data: orderJournal = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetOrderJournalQuery(orderJournalQuery)

    const formattedTasks = orderJournal.data.map((row) => ({
        key: row.order_journal_id,
        id: row.order_journal_id,
        user: row.user.email,
        action: row.comment,
        date: formatDate(row.createdAt, true),
        status: row.order_status.order_status_name,
    }))

    if (isError) {
        return <CustomAlert />
    }

    return (
        <DataTable
            data={formattedTasks}
            columns={orderJournalColumns}
            getTableInfo={(pageSize, pageIndex) => {
                setOrderJournalQuery({
                    ...orderJournalQuery,
                    offset: { count: pageSize, page: pageIndex + 1 },
                })
            }}
            paginationInfo={{
                itemCount: orderJournal.count,
                pageSize: orderJournalQuery.offset.count,
                pageIndex: orderJournalQuery.offset.page,
            }}
            isLoading={isLoading}
        />
    )
}

export default OrderJournalContent
