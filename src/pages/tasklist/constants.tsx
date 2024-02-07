import { TasksFilterColumns } from './tasks-columns'
import { OrderMyPayloadInterface } from '@/types/interface/orders'

export const initialColumnVisibility: TasksFilterColumns = {
    key: true,
    id: true,
    checkpoint: true,
    taskDescription: true,
    status: true,
    taskName: true,
    priorityStatus: true,
    executor: true,
    facility: true,
    branch: true,
    deliveryDate: true,
}


export const initialCheckpointQuery = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
    period: {},
}

export const personalOrdersQuery: OrderMyPayloadInterface = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
    period: {
        date_start: '2024-01-01',
        date_end: '2024-01-26',
    },
}

export const placeholderQuery = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
    period: {
        date_start: '2024-01-01',
        date_end: '2024-12-26',
    },
}
