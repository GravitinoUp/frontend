import i18next from '../../i18n.ts'
import AddUserForm from './add-user-form'
import { UserInterface } from '@/types/interface/user'

export const usersFormTab = (user?: UserInterface) => [
    {
        value: 'userInfo',
        head: i18next.t('tabs.common'),
        isDialog: true,
        content: <AddUserForm user={user} />,
    },
    {
        value: 'roles',
        head: i18next.t('tabs.roles.and.permissions'),
        isDialog: true,
        content: <p>{i18next.t('tabs.roles.and.permissions')}</p>,
    },
    {
        value: 'image',
        head: i18next.t('tabs.image'),
        isDialog: true,
        content: <p>{i18next.t('tabs.image')}</p>,
    },
]
