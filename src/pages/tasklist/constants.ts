import { TasksFilterColumns } from './tasks-columns.tsx'

export const initialColumnVisibility: TasksFilterColumns = {
    key: true,
    order_id: true,
    checkpoint_name: true,
    order_description: true,
    order_status_name: true,
    order_name: true,
    priority_name: true,
    executor: true,
    creator: true,
    facility_name: true,
    branch_name: true,
    deliveryDate: true,
    ended_at_datetime: true,
    taskType: true,
}

export const placeholderQuery = {
    offset: {
        count: 10,
        page: 1,
    },
    filter: {},
    sorts: {},
    period: {
        date_start: '2024-01-01',
        date_end: '2025-01-26',
    },
}
