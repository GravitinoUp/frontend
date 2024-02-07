import AddRoleForm from './add-role-form'
import { RoleInterface } from '@/types/interface/roles'

export const roleFormTab = (role?: RoleInterface) => [
    {
        value: 'role-creation',
        head: 'Создание роли',
        isDialog: true,
        content: <AddRoleForm role={role} />,
    },
]
