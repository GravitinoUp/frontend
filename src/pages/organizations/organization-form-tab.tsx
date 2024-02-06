import AddOrganizationForm from './add-organization-form'
import { OrganizationInterface } from '@/types/interface/organizations'

export const organizationFormTab = (organization?: OrganizationInterface) => [
    {
        value: 'create-organization',
        head: 'ОРГАНИЗАЦИЯ',
        isDialog: true,
        height: 755,
        content: <AddOrganizationForm organization={organization} />,
    },
]
