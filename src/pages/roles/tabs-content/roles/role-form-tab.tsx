import AddRoleForm from './add-role-form'
import i18next from '../../../../i18n.ts'
import { RoleInterface } from '@/types/interface/roles'

export const roleFormTab = (role?: RoleInterface) => [
    {
        value: 'role-creation',
        head: i18next.t('tabs.role.creation'),
        isDialog: true,
        content: <AddRoleForm role={role} />,
    },
]
