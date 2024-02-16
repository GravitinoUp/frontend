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

export interface ExecutorInterface {
    organization_id: number
    organization_type_id: number
    full_name: string
    short_name: string
    register_number: string
    phone: string
    email: string
}

export interface OrderPayloadInterface extends IQuery {
    sorts: OrderSortInterface
    filter: RecursivePartial<OrderFilterInterface>
    period: {
        date_start: string
        date_end: string
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
    planned_datetime: Date
    task_end_datetime: Date
    ended_at_datetime?: Date | null
    task: TaskInterface
    order_status: OrderStatusInterface
    priority: PriorityInterface
    createdAt: Date
    updatedAt: Date
    property_values?: number[] | null
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

// TASK
export interface TaskInterface {
    task_id: number
    task_name: string
    task_description?: string | null
    category: CategoryInterface
    periodicity: PeriodicityInterface | null
    period_start?: Date | null
    period_end?: Date | null
    createdAt: Date | null
    updatedAt: Date | null
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

// CATEGORY

export interface CategoryInterface {
    category_id: number
    category_name: string
}

export type CategorySortInterface = Partial<
    Record<keyof CategoryInterface, SortOptionsType>
>

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

export interface PriorityPayloadInterface {}

export type PrioritySortInterface = Partial<
    Record<keyof PriorityInterface, SortOptionsType>
>
