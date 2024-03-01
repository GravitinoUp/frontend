import { Fragment, useCallback, useContext, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import FormDialog from '@/components/form-dialog/form-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { TasksFilterQueryContext } from '@/context/tasks/tasks-filter-query.tsx'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { EditTaskForm } from '@/pages/tasklist/components/edit-task-form.tsx'
import { useDeleteOrderMutation, useGetPersonalOrdersQuery } from '@/redux/api/orders.ts'
import { FormattedTaskInterface, OrderInterface } from '@/types/interface/orders'

export const ActionButtons = ({ task }: { task: FormattedTaskInterface }) => {
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOrder, { isError, isSuccess, isLoading }] =
        useDeleteOrderMutation()
    const { t } = useTranslation()
    const { personalOrdersQuery } = useContext(TasksFilterQueryContext)
    const { data: tasks = [] } = useGetPersonalOrdersQuery(
        personalOrdersQuery,
        {
            selectFromResult: (result) => ({
                ...result,
                data: result.data?.data,
            }),
        },
    )
    const taskInfo = tasks.find((item) => item.order_id === task?.id) as OrderInterface

    const deleteSuccessMsg = useMemo(() => t('toast.success.description.delete.f', {
        entityType: t('order'),
        entityName: taskInfo?.order_name || '',
    }), [])

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
                addItemForm={<EditTaskForm task={taskInfo} />}
            />
            <DropdownMenu modal={false}>
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
                    {
                        task.taskType === null &&
                        <DropdownMenuItem
                            onClick={() => {
                                setFormOpen(true)
                            }}
                        >
                            {t('action.dropdown.edit')}
                        </DropdownMenuItem>
                    }
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
