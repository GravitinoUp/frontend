import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { defaultQuery } from '@/constants/constants.ts'
import { OrderPayloadInterface } from '@/types/interface/orders.ts'

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
