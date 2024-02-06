import { Fragment, useEffect, useState } from 'react'
import { MoreVertical } from 'lucide-react'
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
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useDeleteRoleMutation } from '@/redux/api/roles'
import { RoleInterface } from '@/types/interface/roles'

export const ActionsDropdown = ({ role }: { role: RoleInterface }) => {
    const [deleteRole, { isError, isSuccess, isLoading }] =
        useDeleteRoleMutation()

    const { toast } = useToast()

    useEffect(() => {
        if (isError) {
            toast({
                variant: 'destructive',
                title: 'Упс! Что-то пошло не так.',
                description: 'Возникла проблема с запросом',
                duration: 3000,
                action: (
                    <ToastAction
                        altText="Попробуйте еще раз"
                        onClick={() => deleteRole(role.role_id)}
                    >
                        Попробуйте еще раз
                    </ToastAction>
                ),
            })
        }

        if (isSuccess) {
            toast({
                description: `Роль "${name}" удалена`,
                duration: 1500,
            })
        }
    }, [isError, isSuccess, toast])
    const [formOpen, setFormOpen] = useState(false)

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
                        <span className="sr-only">Открыть меню</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setFormOpen(true)
                        }}
                    >
                        Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-[#FF6B6B]"
                        onClick={() => deleteRole(role.role_id)}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаляем...' : 'Удалить'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
