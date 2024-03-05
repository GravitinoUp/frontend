import { TasksFilterColumns } from './tasks-columns.tsx'

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

