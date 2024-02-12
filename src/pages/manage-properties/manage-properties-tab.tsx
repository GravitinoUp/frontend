import AddPropertyForm from './add-property-form'
import ManagePropertiesContent from './manage-properties-content'
import { EntityType } from '@/types/interface/fetch'

export const managePropertiesFormTab = (entity: EntityType) => [
    {
        value: 'propertyCreate',
        head: 'СОЗДАНИЕ ХАРАКТЕРИСТИКИ',
        isDialog: true,
        content: <AddPropertyForm entity={entity} />,
    },
]

export const managePropertiesPageTab = [
    {
        value: 'Users',
        head: 'Пользователи',
        isDialog: false,
        content: <ManagePropertiesContent entity="Users" />,
    },
    {
        value: 'Tasks',
        head: 'Задачи',
        isDialog: false,
        content: <ManagePropertiesContent entity="Tasks" />,
    },
    {
        value: 'Reports',
        head: 'Отчеты',
        isDialog: false,
        content: <ManagePropertiesContent entity="Reports" />,
    },
    {
        value: 'Organizations',
        head: 'Организации',
        isDialog: false,
        content: <ManagePropertiesContent entity="Organizations" />,
    },
    {
        value: 'Checkpoints',
        head: 'Пункты пропуска',
        isDialog: false,
        content: <ManagePropertiesContent entity="Checkpoints" />,
    },
    {
        value: 'Branches',
        head: 'Филиалы',
        isDialog: false,
        content: <ManagePropertiesContent entity="Branches" />,
    },
    {
        value: 'Roles',
        head: 'Роли',
        isDialog: false,
        content: <ManagePropertiesContent entity="Roles" />,
    },
]
