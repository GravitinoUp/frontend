import AddPropertyForm from './add-property-form'
import ManagePropertiesContent from './manage-properties-content'
import i18next from '../../i18n.ts'
import { EntityType } from '@/types/interface/fetch'

export const managePropertiesFormTab = (entity: EntityType) => [
    {
        value: 'propertyCreate',
        head: i18next.t('property.add'),
        isDialog: true,
        content: <AddPropertyForm entity={entity} />,
    },
]

export const managePropertiesPageTab = [
    {
        value: 'Users',
        head: i18next.t('users'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Users" />,
    },
    {
        value: 'Tasks',
        head: i18next.t('tasks'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Tasks" />,
    },
    {
        value: 'Reports',
        head: i18next.t('reports'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Reports" />,
    },
    {
        value: 'Organizations',
        head: i18next.t('organizations'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Organizations" />,
    },
    {
        value: 'Checkpoints',
        head: i18next.t('checkpoints'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Checkpoints" />,
    },
    {
        value: 'Branches',
        head: i18next.t('branches'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Branches" />,
    },
    {
        value: 'Roles',
        head: i18next.t('roles'),
        isDialog: false,
        content: <ManagePropertiesContent entity="Roles" />,
    },
]
