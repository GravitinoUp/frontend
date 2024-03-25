import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { PayloadInterface } from '@/types/interface/fetch'

const DEFAULT_REPORTS_PER_PAGE = 10

const defaultQuery = {
    offset: {
        count: DEFAULT_REPORTS_PER_PAGE,
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
    reportsQuery: PayloadInterface<any, any>
    setReportsQuery: Dispatch<SetStateAction<PayloadInterface<any, any>>>
}

export const ReportsFilterQueryContext = createContext<ContextValuesType>(null!)

const getInitialQuery = () => {
    const savedQuery = localStorage.getItem('reportsQuery')
    return savedQuery !== null ? JSON.parse(savedQuery) : defaultQuery
}

export const ReportsFilterQueryProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [reportsQuery, setReportsQuery] = useState(getInitialQuery)

    useEffect(() => {
        localStorage.setItem('reportsQuery', JSON.stringify(reportsQuery))
    }, [reportsQuery])

    const contextState = useMemo(
        () => ({
            reportsQuery,
            setReportsQuery,
        }),
        [reportsQuery]
    )

    return (
        <ReportsFilterQueryContext.Provider value={contextState}>
            {children}
        </ReportsFilterQueryContext.Provider>
    )
}
