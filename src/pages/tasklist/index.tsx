import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddTaskForm from './components/add-task-form.tsx'
import ExportForm from './components/export-form.tsx'
import ImportForm from './components/import-form.tsx'
import TaskListContent from './tasklist-content.tsx'
import i18next from '../../i18n.ts'
import CalendarForm from '@/components/calendar-form/calendar-form'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { TasksFilterQueryContext } from '@/context/tasks/tasks-filter-query.tsx'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'

const tasksPageTabs = [
    {
        value: 'allTasks',
        head: i18next.t('all'),
        content: <TaskListContent />,
    },
    {
        value: 'onCheckTasks',
        head: i18next.t('task.status.verification'),
        content: <p>{i18next.t('task.status.verification')}</p>,
    },
    {
        value: 'closedTasks',
        head: i18next.t('closed'),
        content: <p>{i18next.t('closed')}</p>,
    },
]

export default function TaskListPage() {
    const { personalOrdersQuery } = useContext(TasksFilterQueryContext)
    const { refetch } = useGetPersonalOrdersQuery(personalOrdersQuery)
    const [formOpen, setFormOpen] = useState(false)
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('tasks.list')}
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
                        <FormDialog
                            open={exportFormOpen}
                            setOpen={setExportFormOpen}
                            actionButton={<ExcelButton buttonType="export" />}
                            addItemForm={<ExportForm />}
                        />
                        <FormDialog
                            open={importFormOpen}
                            setOpen={setImportFormOpen}
                            actionButton={<ExcelButton buttonType="import" />}
                            addItemForm={<ImportForm />}
                        />
                    </div>
                </div>
            }
        >
            <CustomTabs tabs={tasksPageTabs} />
        </PageLayout>
    )
}
