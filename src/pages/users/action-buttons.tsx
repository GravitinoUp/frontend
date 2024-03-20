import { Fragment, useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AddUserForm from './add-user-form'
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
import { useResetUserPasswordMutation } from '@/redux/api/users.ts'
import { UserInterface } from '@/types/interface/user'
import { getPermissionValue } from '@/utils/helpers'

export const ActionButtons = ({ user }: { user: UserInterface }) => {
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()
    const [resetPassword, { error, isSuccess }] = useResetUserPasswordMutation()

    const resetSuccessMsg = useMemo(
        () => t('toast.success.description.password.reset'),
        []
    )

    const handlePasswordReset = useCallback(() => {
        resetPassword(String(user.user_id))
    }, [user, resetPassword])

    useErrorToast(handlePasswordReset, error)
    useSuccessToast(resetSuccessMsg, isSuccess)

    return (
        getPermissionValue([PermissionEnum.UserUpdate]) && (
            <Fragment>
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    trigger={null}
                    content={
                        <AddUserForm user={user} setDialogOpen={setFormOpen} />
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
                        <DropdownMenuItem onClick={handlePasswordReset}>
                            {t('action.dropdown.password.reset')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Fragment>
        )
    )
}
