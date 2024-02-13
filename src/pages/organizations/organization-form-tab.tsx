import AddOrganizationForm from './add-organization-form'
import i18next from '../../i18n.ts'
import { OrganizationInterface } from '@/types/interface/organizations'

export const organizationFormTab = (organization?: OrganizationInterface) => [
    {
        value: 'create-organization',
        head: i18next.t('organization'),
        isDialog: true,
        content: <AddOrganizationForm organization={organization} />,
    },
]
