import { Fragment, useEffect, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import AddTaskForm from './add-task-form'
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
import {
    useDeleteOrderMutation,
    useGetPersonalOrdersQuery,
} from '@/redux/api/orders'
import {
    FormattedTaskInterface,
    OrderMyPayloadInterface,
} from '@/types/interface/orders'

const personalOrdersQuery: OrderMyPayloadInterface = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
    period: {
        date_start: '2024-01-01',
        date_end: '2024-12-26',
    },
}

export const ActionButtons = ({ task }: { task: FormattedTaskInterface }) => {
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOrder, { isError, isSuccess, isLoading }] =
        useDeleteOrderMutation()

    const { data: tasks = [] } = useGetPersonalOrdersQuery(personalOrdersQuery)
    const taskInfo = tasks.find((item) => item.order_id === task?.id)

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
                        onClick={() => deleteOrder(task.id)}
                    >
                        Попробуйте еще раз
                    </ToastAction>
                ),
            })
        }

        if (isSuccess) {
            toast({
                description: `Задача "${task.taskName}" удалена`,
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
                addItemForm={<AddTaskForm task={taskInfo} />}
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
                            deleteOrder(task.id)
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
