import { FacilityInterface, FacilitySortInterface } from '../facility'
import { IQuery, SortOptionsType } from '../fetch'
import { GroupInterface, GroupSortInterface } from '../group'
import {
    OrganizationInterface,
    OrganizationSortInterface,
} from '../organizations'
import { RoleInterface, RoleSortInterface } from '../roles'
import { UserInterface } from '../user'
import { RecursivePartial } from '@/utils/recursive-partial'

export interface FormattedTaskInterface {
    key: number
    id: number
    facility?: string
    checkpoint?: string
    taskDescription?: string | null
    status: string
    taskName: string
    priorityStatus?: string
    executor?: string
    branch?: string
    deliveryDate?: string
    taskCreator?: string
    taskType?: number | null
}

export interface OrderPayloadInterface extends IQuery {
    sorts: OrderSortInterface
    filter: RecursivePartial<OrderFilterInterface>
    period: {
        date_start?: string
        date_end?: string
    }
}

// ORDER
export interface OrderInterface {
    order_id: number
    order_name?: string | null
    order_description?: string | null
    facility: FacilityInterface
    executor: OrganizationInterface
    completed_by?: OrderUserInterface | null
    creator: UserInterface
    planned_datetime: string
    task_end_datetime: string
    ended_at_datetime?: string | null
    task: TaskInterface
    order_status: OrderStatusInterface
    priority: PriorityInterface
    createdAt: Date
    updatedAt: Date
    property_values?: number[] | null
    files: string[]
}

export interface OrderUserInterface {
    user_id: number
    is_active: boolean
    email: string
    role: RoleInterface
    group?: GroupInterface | null
    last_name: string
    first_name: string
    patronymic: string
    phone: string
    organization: OrganizationInterface
}

export interface OrderSortInterface {
    order_id?: SortOptionsType
    order_name?: SortOptionsType
    order_description?: SortOptionsType
    completed_by?: OrderUserSortInterface | null
    creator?: OrderUserSortInterface | null
    planned_datetime?: SortOptionsType
    task_end_datetime?: SortOptionsType
    ended_at_datetime?: SortOptionsType
    facility?: FacilitySortInterface | null
    task?: TaskSortInterface | null
    executor?: OrganizationSortInterface | null
    priority?: PrioritySortInterface | null
    order_status?: OrderStatusSortInterface | null
}

export interface OrderUserSortInterface {
    user_id?: SortOptionsType
    is_active?: SortOptionsType
    email?: SortOptionsType
    role?: RoleSortInterface | null
    group?: GroupSortInterface | null
    organization?: OrganizationSortInterface | null
    last_name?: SortOptionsType
    first_name?: SortOptionsType
    patronymic?: SortOptionsType
    phone?: SortOptionsType
}

export type OrderFilterInterface = Omit<OrderInterface, 'order_status'> & {
    order_status: OrderStatusInterface[]
}

export interface NewOrderBodyInterface {
    order_name: string
    order_description: string
    branch_ids: number[]
    checkpoint_ids?: number[]
    facility_ids?: number[]
    executor_ids: number[]
    planned_datetime: string
    task_end_datetime: string
    priority_id: number
    property_values: string[]
}

export interface OrderUpdateInterface {
    order_id: number
    task_id: number
    order_name: string
    order_description: string
    facility_id: number
    executor_id: number
    completed_by?: number
    creator_id?: number
    order_status_id?: number
    planned_datetime: string
    task_end_datetime: string
    ended_at_datetime?: string
    priority_id: number
    property_values: []
}

// TASK
export interface TaskInterface {
    task_id: number
    task_name: string
    task_description?: string | null
    category: CategoryInterface
    periodicity: PeriodicityInterface | null
    period_start?: Date | null
    period_end?: Date | null
    createdAt?: Date | null
    updatedAt?: Date | null
}

export interface TaskSortInterface {
    task_id?: SortOptionsType
    task_name?: SortOptionsType
    task_description?: SortOptionsType
    category?: CategorySortInterface | null
    periodicity?: PeriodicitySortInterface | null
    period_start?: SortOptionsType
    period_end?: SortOptionsType
}

export interface NewTaskBodyInterface {
    task_name: string
    task_description: string
    category_id: number
    periodicity_id: number
    branch_ids: number[]
    checkpoint_ids?: number[]
    facility_ids?: number[]
    executor_ids: number[]
    priority_id: number
    period_start: string
    period_end: string
}

// CATEGORY

export interface CategoryInterface {
    category_id: number
    category_name: string
}

export type CategorySortInterface = Partial<
    Record<keyof CategoryInterface, SortOptionsType>
>

export interface CategoryPayloadInterface extends IQuery {
    sorts: CategorySortInterface
    filter: Partial<CategoryInterface>
}

// PERIODICITY

export interface PeriodicityInterface {
    periodicity_id: number
    periodicity_name: string
}

export type PeriodicitySortInterface = Partial<
    Record<keyof PeriodicityInterface, SortOptionsType>
>

// ORDER STATUS
export interface UpdateStatusPayloadInterface {
    order_id: number
    order_status_id: string
}

export interface OrderStatusInterface {
    order_status_id: number
    order_status_name: string
}

export type OrderStatusSortInterface = Partial<
    Record<keyof OrderStatusInterface, SortOptionsType>
>

// PRIORITY

export interface PriorityInterface {
    priority_id: number
    priority_name: string
}

export type PrioritySortInterface = Partial<
    Record<keyof PriorityInterface, SortOptionsType>
>
