import { useState } from 'react'
import AddTaskForm from './add-task-form'
import ImportForm from './import-form'
import TaskListContent from './tasklist-content'
import CloseRounded from '@/assets/icons/close_rounded.svg'
import CalendarForm from '@/components/calendar-form/calendar-form'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'
import { OrderMyPayloadInterface } from '@/types/interface/orders'

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

const tasksFormTab = [
    {
        value: 'taskCreation',
        head: 'ЗАДАЧА',
        isDialog: true,
        height: 755,
        content: <AddTaskForm />,
    },
    {
        value: 'files',
        head: 'ФАЙЛЫ',
        isDialog: true,
        height: 755,
        content: <p>файлы</p>,
    },
]

export default function TaskListPage() {
    const personalOrdersQuery: OrderMyPayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
        period: {
            date_start: '2024-01-01',
            date_end: '2024-01-26',
        },
    }

    const { refetch } = useGetPersonalOrdersQuery(personalOrdersQuery)
    const [formOpen, setFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    return (
        <PageLayout
            title="Список задач"
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
                        <CustomTabs
                            tabs={tasksFormTab}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
            rightBlock={
                <div>
                    <CalendarForm open={false} />
                    <div className="flex gap-3">
                        <ExcelButton buttonType="export" onClick={() => {}} />
                        <FormDialog
                            open={importFormOpen}
                            setOpen={setImportFormOpen}
                            actionButton={<ExcelButton buttonType="import" />}
                            addItemForm={<ImportForm />}
                            closeIcon={<CloseRounded />}
                        />
                    </div>
                </div>
            }
        >
            <CustomTabs tabs={tasksPageTabs} />
        </PageLayout>
    )
}
