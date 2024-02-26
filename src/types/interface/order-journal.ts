import { IQuery, SortOptionsType } from './fetch'
import { OrderStatusInterface, OrderStatusSortInterface } from './orders'
import { UserInterface, UserSortInterface } from './user'

export interface FormattedOrderJournalInterface {
    key: number
    id: number
    user: string
    action: string
    date: string
    status: string
}

export interface OrderJournalPayloadInterface extends IQuery {
    filter: Partial<OrderJournalInterface>
    sorts: OrderJournalSortInterface
}

export interface OrderJournalInterface {
    order_journal_id: number
    order_id: number
    comment: string
    changed_field: string
    old_value: string
    new_value: string
    user: UserInterface
    order_status: OrderStatusInterface
    createdAt: Date
}

export interface OrderJournalSortInterface {
    order_journal_id?: SortOptionsType
    order_id?: SortOptionsType
    comment?: SortOptionsType
    changed_field?: SortOptionsType
    old_value?: SortOptionsType
    new_value?: SortOptionsType
    user?: UserSortInterface
    order_status?: OrderStatusSortInterface
    createdAt?: SortOptionsType
}
