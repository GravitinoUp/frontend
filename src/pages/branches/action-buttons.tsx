import { Fragment, useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { branchesFormTab } from './branches-form-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useDeleteBranchMutation } from '@/redux/api/branch'
import { BranchInterface } from '@/types/interface/branch'

export const ActionButtons = ({ branch }: { branch: BranchInterface }) => {
    const [deleteBranch, { error, isSuccess, isLoading }] =
        useDeleteBranchMutation()
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    const deleteSuccessMsg = useMemo(
        () =>
            t('toast.success.description.delete.m', {
                entityType: t('branch'),
                entityName: branch.branch_name,
            }),
        []
    )

    const handleBranchDelete = useCallback(() => {
        deleteBranch(branch.branch_id)
    }, [branch.branch_id, deleteBranch])

    useErrorToast(handleBranchDelete, error)
    useSuccessToast(deleteSuccessMsg, isSuccess)

    return (
        <Fragment>
            <DialogWindow
                open={formOpen}
                setOpen={setFormOpen}
                trigger={null}
                content={
                    <CustomTabs
                        tabs={branchesFormTab(branch)}
                        setDialogOpen={setFormOpen}
                    />
                }
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A9099]"
                    >
                        <span className="sr-only">
                            {t('action.dropdown.menu.open')}
                        </span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setFormOpen(true)
                        }}
                    >
                        {t('action.dropdown.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-[#FF6B6B]"
                        onClick={handleBranchDelete}
                        disabled={isLoading}
                    >
                        {t('action.dropdown.delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
