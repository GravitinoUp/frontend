import ManageUserPropertiesContent from './manage-user-properties-content'

export const managePropertiesFormTab = [
    {
        value: 'propertyCreate',
        head: 'Создание характеристики',
        isDialog: true,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
]

export const managePropertiesPageTab = [
    {
        value: 'users',
        head: 'Пользователи',
        isDialog: false,
        height: 755,
        content: <ManageUserPropertiesContent />,
    },
    {
        value: 'tasks',
        head: 'Задачи',
        isDialog: false,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
    {
        value: 'reports',
        head: 'Отчеты',
        isDialog: false,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
    {
        value: 'organizations',
        head: 'Организации',
        isDialog: false,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
    {
        value: 'checkpoints',
        head: 'Пункты пропуска',
        isDialog: false,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
    {
        value: 'branches',
        head: 'Филиалы',
        isDialog: false,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
    {
        value: 'roles',
        head: 'Роли',
        isDialog: false,
        height: 755,
        content: <p>PLACEHOLDER</p>,
    },
]
