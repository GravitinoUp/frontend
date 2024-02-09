import AddUserForm from './add-user-form'
import { UserInterface } from '@/types/interface/user'

export const usersFormTab = (user?: UserInterface) => [
    {
        value: 'userInfo',
        head: 'ОБЩЕЕ',
        isDialog: true,
        content: <AddUserForm user={user} />,
    },
    {
        value: 'roles',
        head: 'РОЛИ И ПРАВА ДОСТУПА',
        isDialog: true,
        content: <p>РОЛИ И ПРАВА ДОСТУПА</p>,
    },
    {
        value: 'image',
        head: 'ИЗОБРАЖЕНИЕ',
        isDialog: true,
        content: <p>ИЗОБРАЖЕНИЕ</p>,
    },
]
