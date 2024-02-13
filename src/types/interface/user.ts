import { IQuery, SortOptionsType } from './fetch'
import { GroupInterface, GroupSortInterface } from './group'
import {
    OrganizationInterface,
    OrganizationSortInterface,
} from './organizations'
import { RoleInterface, RoleSortInterface } from './roles'

export interface UsersPayloadInterface extends IQuery {
    sorts: UserSortInterface
    filter: Partial<UserInterface>
}

export interface FormattedUsersInterface {
    user: UserInterface
    key: number
    id: number
    FIO: string
    phone?: string
    company?: string
    type?: string
    role: string
    is_active: boolean
}

export interface UserPayloadInterface {
    user_id?: number
    last_name: string
    first_name: string
    patronymic: string
    phone: string
    role_id: string
    group_id?: string
    email: string
    password: string
}

export interface OrganizationUserPayloadInterface {
    user_id?: number
    organization_type_id: string
    full_name: string
    short_name: string
    phone: string
    role_id: string
    group_id?: string
    email: string
    password: string
}

// USER

export interface UserInterface {
    user_id: number
    is_active: boolean
    email: string
    role: RoleInterface
    organization?: OrganizationInterface | null
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
    person_id: number
    last_name: string
    first_name: string
    patronymic: string
    gender: unknown
    phone: string
    createdAt: string
    updatedAt: string
}

export interface PersonSortInterface {
    last_name?: SortOptionsType
    first_name?: SortOptionsType
    patronymic?: SortOptionsType
    phone?: SortOptionsType
}
