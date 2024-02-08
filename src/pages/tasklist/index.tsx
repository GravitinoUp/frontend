import { useState } from 'react'
import AddTaskForm from './add-task-form'
import { personalOrdersQuery } from './constants'
import TaskListContent from './tasklist-content'
import CalendarForm from '@/components/calendar-form/calendar-form'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'

const tasksPageTabs = [
    {
        value: 'allTasks',
        head: 'Все',
        content: <TaskListContent />,
    },
    {
        value: 'onCheckTasks',
        head: 'На проверке',
        content: <p>На проверке</p>,
    },
    {
        value: 'closedTasks',
        head: 'Закрыто',
        content: <p>Закрыто</p>,
    },
]

export default function TaskListPage() {
    const { refetch } = useGetPersonalOrdersQuery(personalOrdersQuery)
    const [formOpen, setFormOpen] = useState(false)

    return (
        <PageLayout
            title="Список задач"
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={<AddTaskForm setDialogOpen={setFormOpen} />}
                />
            }
            rightBlock={
                <div>
                    <CalendarForm open={false} />
                    <div className="flex gap-3">
                        <ExcelButton type="export" onClick={() => {}} />
                        <ExcelButton type="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            <CustomTabs tabs={tasksPageTabs} />
        </PageLayout>
    )
}
