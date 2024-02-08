import AddPropertyForm from './add-property-form'
import ManagePropertiesContent from './manage-properties-content'
import { EntityType } from '@/types/interface/fetch'

export const managePropertiesFormTab = (entity: EntityType) => [
    {
        value: 'propertyCreate',
        head: 'СОЗДАНИЕ ХАРАКТЕРИСТИКИ',
        isDialog: true,
        height: 755,
        content: <AddPropertyForm entity={entity} />,
    },
]

export const managePropertiesPageTab = [
    {
        value: 'Users',
        head: 'Пользователи',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Users" />,
    },
    {
        value: 'Tasks',
        head: 'Задачи',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Tasks" />,
    },
    {
        value: 'Reports',
        head: 'Отчеты',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Reports" />,
    },
    {
        value: 'Organizations',
        head: 'Организации',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Organizations" />,
    },
    {
        value: 'Checkpoints',
        head: 'Пункты пропуска',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Checkpoints" />,
    },
    {
        value: 'Branches',
        head: 'Филиалы',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Branches" />,
    },
    {
        value: 'Roles',
        head: 'Роли',
        isDialog: false,
        height: 755,
        content: <ManagePropertiesContent entity="Roles" />,
    },
]
