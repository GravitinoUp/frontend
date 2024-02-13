import i18next from '../../i18n.ts'
import { UserInterface } from '@/types/interface/user'

export const usersFormTab = (user?: UserInterface) => [
    {
        value: 'userInfo',
        head: i18next.t('tabs.common'),
        isDialog: true,
        content: <p>{user?.user_id}</p>,
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
