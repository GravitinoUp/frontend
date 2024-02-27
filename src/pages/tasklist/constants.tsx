import { TasksFilterColumns } from './tasks-columns'

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

export interface NewOrderBodyInterface {
    order_name: string
    order_description: string
    branch_ids: number[]
    checkpoint_ids: number[]
    facility_ids: number[]
    executor_ids: number[]
    planned_datetime: string
    task_end_datetime: string
    priority_id: number
    property_values: string[]
}
