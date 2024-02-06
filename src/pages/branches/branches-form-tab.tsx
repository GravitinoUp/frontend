import AddBranchForm from './add-branch-form'
import { BranchInterface } from '@/types/interface/branch'

export const branchesFormTab = (branch?: BranchInterface) => [
    {
        value: 'branchCreation',
        head: 'ФИЛИАЛЫ',
        isDialog: true,
        height: 755,
        content: <AddBranchForm branch={branch} />,
    },
]
