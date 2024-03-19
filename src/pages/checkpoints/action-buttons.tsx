import { Fragment, useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { checkpointsFormTab } from './checkpoint-form-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PermissionEnum } from '@/constants/permissions.enum'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useDeleteCheckpointMutation } from '@/redux/api/checkpoints'
import { CheckpointInterface } from '@/types/interface/checkpoint'
import { getPermissionValue } from '@/utils/helpers'

export const ActionButtons = ({
    checkpoint,
}: {
    checkpoint: CheckpointInterface
}) => {
    const [deleteCheckpoint, { error, isSuccess, isLoading }] =
        useDeleteCheckpointMutation()
    const { t } = useTranslation()
    const [formOpen, setFormOpen] = useState(false)

    const deleteSuccessMsg = useMemo(
        () =>
            t('toast.success.description.delete.m', {
                entityType: t('checkpoint'),
                entityName: checkpoint.checkpoint_name,
            }),
        []
    )

    const handleCheckpointDelete = useCallback(() => {
        deleteCheckpoint(checkpoint.checkpoint_id)
    }, [checkpoint.checkpoint_id, deleteCheckpoint])

    useErrorToast(handleCheckpointDelete, error)
    useSuccessToast(deleteSuccessMsg, isSuccess)

    return (
        getPermissionValue([
            PermissionEnum.CheckpointUpdate,
            PermissionEnum.CheckpointDelete,
        ]) && (
            <Fragment>
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    trigger={null}
                    content={
                        <CustomTabs
                            tabs={checkpointsFormTab(checkpoint)}
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
                        {getPermissionValue([
                            PermissionEnum.CategoryUpdate,
                        ]) && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setFormOpen(true)
                                }}
                            >
                                {t('action.dropdown.edit')}
                            </DropdownMenuItem>
                        )}
                        {getPermissionValue([
                            PermissionEnum.CheckpointDelete,
                        ]) && (
                            <DropdownMenuItem
                                className="text-[#FF6B6B]"
                                onClick={handleCheckpointDelete}
                                disabled={isLoading}
                            >
                                {t('action.dropdown.delete')}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </Fragment>
        )
    )
}
