import { Fragment, useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AddTaskForm from './add-task-form'
import { placeholderQuery } from './constants'
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
import {
    useDeleteOrderMutation,
    useGetPersonalOrdersQuery,
} from '@/redux/api/orders'
import { FormattedTaskInterface } from '@/types/interface/orders'

export const ActionButtons = ({ task }: { task: FormattedTaskInterface }) => {
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOrder, { isError, isSuccess, isLoading }] =
        useDeleteOrderMutation()
    const { t } = useTranslation()
    const { data: tasks = [] } = useGetPersonalOrdersQuery(placeholderQuery, {
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.data,
        }),
    })
    const taskInfo = tasks.find((item) => item.order_id === task?.id)

    const deleteSuccessMsg = useMemo(
        () =>
            t('toast.success.description.delete.f', {
                entityType: t('order'),
                entityName: task.taskName,
            }),
        []
    )

    const handleOrderDelete = useCallback(() => {
        deleteOrder(task.id)
    }, [task.id, deleteOrder])

    useErrorToast(isError, handleOrderDelete)
    useSuccessToast(deleteSuccessMsg, isSuccess)

    return (
        <Fragment>
            <FormDialog
                open={formOpen}
                setOpen={setFormOpen}
                actionButton={<Fragment />}
                addItemForm={<AddTaskForm task={taskInfo} />}
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
                        onClick={handleOrderDelete}
                        disabled={isLoading}
                    >
                        {t('action.dropdown.delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
