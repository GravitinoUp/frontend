import { IQuery, SortOptionsType } from './fetch'

export interface RolesPayloadInterface extends IQuery {
    sorts: RoleSortInterface
    filter: Partial<RoleInterface>
}

// ROLE

export interface RoleInterface {
    role_id: number
    role_name: string
}

export type RoleSortInterface = Partial<
    Record<keyof RoleInterface, SortOptionsType>
>

// PERMISSION

export interface PermissionsInterface {
    permission_id: number
    permission_sku: string
    permission_name: string
    permission_description: string
    entity_name: string
}

// PERMISSION

export interface RolePermissionInterface {
    role_permission_id: number
    role_id: number | null
    user_id: number | null
    permission: PermissionsInterface
    rights: boolean
}

export interface FormattedPermissionInterface {
    permission_name: string
    permission_description: string
    permission_sku: string
    rights: boolean
}
