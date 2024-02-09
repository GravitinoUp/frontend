import { Fragment, useEffect, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import AddUserForm from './add-user-form'
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
import { useDeleteUserMutation } from '@/redux/api/users'
import { UserInterface } from '@/types/interface/user'

export const ActionButtons = ({ user }: { user: UserInterface }) => {
    const [formOpen, setFormOpen] = useState(false)
    const [deleteUser, { isError, isSuccess, isLoading }] =
        useDeleteUserMutation()

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
                        onClick={() => deleteUser(user.user_id)}
                    >
                        Попробуйте еще раз
                    </ToastAction>
                ),
            })
        }

        if (isSuccess) {
            toast({
                description: `Пользователь удален`,
                duration: 1500,
            })
        }
    }, [isError, isSuccess, toast])

    return (
        <Fragment>
            <FormDialog
                open={formOpen}
                setOpen={setFormOpen}
                actionButton={<Fragment />}
                addItemForm={<AddUserForm user={user} />}
            />
            <DropdownMenu modal={false}>
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
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteUser(user.user_id)
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаляем...' : 'Удалить'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
