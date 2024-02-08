import AddPropertyForm from './add-property-form'
import ManagePropertiesContent from './manage-properties-content'
import { EntityType } from '@/types/interface/fetch'
import { PropertyInterface } from '@/types/interface/properties'

export const managePropertiesFormTab = (
    entity: EntityType,
    property?: PropertyInterface
) => [
    {
        value: 'propertyCreate',
        head: 'СОЗДАНИЕ ХАРАКТЕРИСТИКИ',
        isDialog: true,
        height: 755,
        content: <AddPropertyForm entity={entity} property={property} />,
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
