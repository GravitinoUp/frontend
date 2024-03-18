import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { OrderPayloadInterface } from '@/types/interface/orders'

const DEFAULT_ORDERS_PER_PAGE = 10

export const defaultQuery = {
    offset: {
        count: DEFAULT_ORDERS_PER_PAGE,
        page: 1,
    },
    filter: {},
    sorts: {},
    period: {
        date_start: new Date().toISOString(),
        date_end: new Date().toISOString(),
    },
}

interface ContextValuesType {
    personalOrdersQuery: OrderPayloadInterface
    setPersonalOrdersQuery: Dispatch<SetStateAction<OrderPayloadInterface>>
}

export const TasksFilterQueryContext = createContext<ContextValuesType>(null!)

const getInitialQuery = (): OrderPayloadInterface => {
    const savedQuery = localStorage.getItem('personalOrdersQuery')
    return savedQuery !== null ? JSON.parse(savedQuery) : defaultQuery
}

export const TaskFilterQueryProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [personalOrdersQuery, setPersonalOrdersQuery] =
        useState(getInitialQuery)

    useEffect(() => {
        localStorage.setItem(
            'personalOrdersQuery',
            JSON.stringify(personalOrdersQuery)
        )
    }, [personalOrdersQuery])

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
