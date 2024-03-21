import { IQuery, SortOptionsType } from './fetch'
import { GroupInterface, GroupSortInterface } from './group'
import {
    OrganizationInterface,
    OrganizationSortInterface,
} from './organizations'
import { RoleInterface, RoleSortInterface } from './roles'
import { RecursivePartial } from '@/utils/recursive-partial'

export interface UsersPayloadInterface extends IQuery {
    sorts: UserSortInterface
    filter: RecursivePartial<UserInterface>
}

export interface FormattedUsersInterface {
    user: UserInterface
    key: number
    user_id: number
    FIO: string
    phone?: string
    email?: string
    organization_name?: string
    organization_type_name?: string
    role_name: string
    is_active: boolean
}

export interface UserPayloadInterface {
    user_id?: number
    last_name: string
    first_name: string
    patronymic: string
    phone: string
    role_id: number
    group_id?: number | null
    email: string
    password?: string
}

export interface OrganizationUserPayloadInterface {
    user_id?: number
    organization_type_id: number
    full_name: string
    short_name: string
    phone: string
    facility_ids: number[]
    email: string
    password?: string
}

// USER
export interface UserInterface {
    user_id: number
    is_active: boolean
    is_default_password?: boolean
    email: string
    role: RoleInterface
    organization: OrganizationInterface
    person: PersonInterface
    group: GroupInterface | null
}

export interface UserSortInterface {
    user_id?: SortOptionsType
    email?: SortOptionsType
    is_active?: SortOptionsType
    person?: PersonSortInterface | null
    role?: RoleSortInterface | null
    group?: GroupSortInterface | null
    organization?: OrganizationSortInterface | null
}

// PERSON

export interface PersonInterface {
    person_id: number | null
    last_name: string
    first_name: string
    patronymic: string
    phone: string
    property_values?: number[]
}

export type PersonSortInterface = Omit<
    Partial<Record<keyof PersonInterface, SortOptionsType>>,
    'property_values'
>
