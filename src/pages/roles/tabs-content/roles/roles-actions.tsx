import { Fragment, useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { roleFormTab } from './role-form-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import FormDialog from '@/components/form-dialog/form-dialog'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useDeleteRoleMutation } from '@/redux/api/roles'
import { RoleInterface } from '@/types/interface/roles'

export const ActionsDropdown = ({ role }: { role: RoleInterface }) => {
    const [deleteRole, { isError, isSuccess, isLoading }] =
        useDeleteRoleMutation()
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    const deleteSuccessMsg = useMemo(() => t('toast.success.description.delete.f', {
        entityType: t('role'),
        entityName: role.role_name,
    }), [])

    const handleRoleDelete = useCallback(() => {
        deleteRole(role.role_id)
    }, [role.role_id, deleteRole])

    useErrorToast(isError, handleRoleDelete)
    useSuccessToast(deleteSuccessMsg, isSuccess, setFormOpen)

    return (
        <Fragment>
            <FormDialog
                open={formOpen}
                setOpen={setFormOpen}
                actionButton={<Fragment />}
                addItemForm={
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
                        <span className="sr-only">{t('action.dropdown.menu.open')}</span>
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
                        onClick={() => deleteRole(role.role_id)}
                        disabled={isLoading}
                    >
                        {t('action.dropdown.delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
