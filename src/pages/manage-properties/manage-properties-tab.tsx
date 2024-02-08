import ManagePropertiesContent from './manage-properties-content'

export const managePropertiesFormTab = [
    {
        value: 'propertyCreate',
        head: 'СОЗДАНИЕ ХАРАКТЕРИСТИКИ',
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
        content: <ManagePropertiesContent entity="Users" />,
    },
    {
        value: 'tasks',
        head: 'Задачи',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Tasks" />,
    },
    {
        value: 'reports',
        head: 'Отчеты',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Reports" />,
    },
    {
        value: 'organizations',
        head: 'Организации',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Organizations" />,
    },
    {
        value: 'checkpoints',
        head: 'Пункты пропуска',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Checkpoints" />,
    },
    {
        value: 'branches',
        head: 'Филиалы',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Branches" />,
    },
    {
        value: 'roles',
        head: 'Роли',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Roles" />,
    },
]
