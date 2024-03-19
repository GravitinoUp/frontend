import { Fragment, useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { roleFormTab } from './role-form-tab'
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
import { useDeleteRoleMutation } from '@/redux/api/roles'
import { RoleInterface } from '@/types/interface/roles'
import { getPermissionValue } from '@/utils/helpers'

export const ActionsDropdown = ({ role }: { role: RoleInterface }) => {
    const [deleteRole, { error, isSuccess, isLoading }] =
        useDeleteRoleMutation()
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    const deleteSuccessMsg = useMemo(
        () =>
            t('toast.success.description.delete.f', {
                entityType: t('role'),
                entityName: role.role_name,
            }),
        []
    )

    const handleRoleDelete = useCallback(() => {
        deleteRole(role.role_id)
    }, [role.role_id, deleteRole])

    useErrorToast(handleRoleDelete, error)
    useSuccessToast(deleteSuccessMsg, isSuccess)

    return (
        getPermissionValue([
            PermissionEnum.RoleUpdate,
            PermissionEnum.RoleDelete,
        ]) && (
            <Fragment>
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    trigger={null}
                    content={
                        <CustomTabs
                            tabs={roleFormTab(role)}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
                <DropdownMenu>
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
                        {getPermissionValue([PermissionEnum.RoleUpdate]) && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setFormOpen(true)
                                }}
                            >
                                {t('action.dropdown.edit')}
                            </DropdownMenuItem>
                        )}
                        {getPermissionValue([PermissionEnum.RoleDelete]) && (
                            <DropdownMenuItem
                                className="text-[#FF6B6B]"
                                onClick={handleRoleDelete}
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
