import { UserInterface } from '@/types/interface/user'

export const usersFormTab = (user?: UserInterface) => [
    {
        value: 'userInfo',
        head: 'ОБЩЕЕ',
        isDialog: true,
        height: 755,
        content: <p>{user?.user_id}</p>,
    },
    {
        value: 'roles',
        head: 'РОЛИ И ПРАВА ДОСТУПА',
        isDialog: true,
        height: 755,
        content: <p>РОЛИ И ПРАВА ДОСТУПА</p>,
    },
    {
        value: 'image',
        head: 'ИЗОБРАЖЕНИЕ',
        isDialog: true,
        height: 755,
        content: <p>ИЗОБРАЖЕНИЕ</p>,
    },
]
