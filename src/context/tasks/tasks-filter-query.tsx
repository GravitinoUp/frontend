import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useMemo,
    useState,
} from 'react'
import { OrderPayloadInterface } from '@/types/interface/orders'

const DEFAULT_ORDERS_PER_PAGE = 10

const defaultQuery = {
    offset: {
        count: DEFAULT_ORDERS_PER_PAGE,
        page: 1,
    },
    filter: {},
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

export const TaskFilterQueryProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const savedQuery = localStorage.getItem('personalOrdersQuery')
    const [personalOrdersQuery, setPersonalOrdersQuery] =
        useState<OrderPayloadInterface>(
            savedQuery !== null ? JSON.parse(savedQuery!) : defaultQuery
        )

    const contextState = useMemo(
        () => ({
            personalOrdersQuery,
            setPersonalOrdersQuery,
        }),
        [personalOrdersQuery]
    )

    return (
        <TasksFilterQueryContext.Provider value={contextState}>
            {children}
        </TasksFilterQueryContext.Provider>
    )
}
