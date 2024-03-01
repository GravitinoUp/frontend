import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import { OrderPayloadInterface } from '@/types/interface/orders'

const DEFAULT_ORDERS_PER_PAGE = 10

const defaultQuery = {
    offset: {
        count: DEFAULT_ORDERS_PER_PAGE,
        page: 1,
    },
    filter: {
        order_status: [
            {
                order_status_id: 3,
            },
        ],
    },
    sorts: {},
    period: {
        date_start: '2024-01-01',
        date_end: '2024-01-26',
    },
}

interface ContextValuesType {
    personalOrdersQuery: OrderPayloadInterface
    setPersonalOrdersQuery: Dispatch<SetStateAction<OrderPayloadInterface>>
}

export const TasksFilterQueryContext = createContext<ContextValuesType>(null!)

export const TaskFilterQueryProvider = ({ children }: { children: ReactNode }) => {
    const [personalOrdersQuery, setPersonalOrdersQuery] = useState<OrderPayloadInterface>(defaultQuery)

    const contextState = useMemo(() => (
        {
            personalOrdersQuery,
            setPersonalOrdersQuery,
        }
    ), [personalOrdersQuery])

    return (
        <TasksFilterQueryContext.Provider value={contextState}>
            {children}
        </TasksFilterQueryContext.Provider>
    )
}