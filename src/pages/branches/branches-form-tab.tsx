import AddBranchForm from './add-branch-form'
import i18next from '../../i18n.ts'
import { BranchInterface } from '@/types/interface/branch'

export const branchesFormTab = (branch?: BranchInterface) => [
    {
        value: 'branchCreation',
        head: i18next.t('branches'),
        isDialog: true,
        content: <AddBranchForm branch={branch} />,
    },
]
