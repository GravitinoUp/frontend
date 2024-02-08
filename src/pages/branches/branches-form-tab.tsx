import AddBranchForm from './add-branch-form'
import { BranchInterface } from '@/types/interface/branch'

export const branchesFormTab = (branch?: BranchInterface) => [
    {
        value: 'branchCreation',
        head: 'ФИЛИАЛЫ',
        isDialog: true,
        content: <AddBranchForm branch={branch} />,
    },
]
