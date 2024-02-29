import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddTaskForm from './add-task-form'
import { placeholderQuery } from './constants'
import ExportForm from './export-form'
import ImportForm from './import-form'
import TaskListContent from './tasklist-content'
import i18next from '../../i18n.ts'
import CalendarForm from '@/components/calendar-form/calendar-form'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { TASK_STATUSES } from '@/constants/constants.ts'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'

const tasksPageTabs = (all: number) => [
    {
        value: 'allTasks',
        head: i18next.t('all'),
        content: <TaskListContent />,
        count: all,
    },
    {
        value: 'createdTasks',
        head: i18next.t('task.status.header.created'),
        content: <TaskListContent orderStatus={TASK_STATUSES.CREATED} />,
        count: -1,
    },
    {
        value: 'appointedTasks',
        head: i18next.t('task.status.header.appointed'),
        content: <TaskListContent orderStatus={TASK_STATUSES.APPOINTED} />,
        count: -1,
    },
    {
        value: 'inProgressTasks',
        head: i18next.t('task.status.in-progress'),
        content: <TaskListContent orderStatus={TASK_STATUSES.IN_PROGRESS} />,
        count: -1,
    },
    {
        value: 'verificationTasks',
        head: i18next.t('task.status.verification'),
        content: (
            <TaskListContent orderStatus={TASK_STATUSES.ON_VERIFICATION} />
        ),
        count: -1,
    },
    {
        value: 'closedTasks',
        head: i18next.t('task.status.header.closed'),
        content: <TaskListContent orderStatus={TASK_STATUSES.CLOSED} />,
        count: -1,
    },
    {
        value: 'canceledTasks',
        head: i18next.t('task.status.header.canceled'),
        content: <TaskListContent orderStatus={TASK_STATUSES.CANCELED} />,
        count: -1,
    },
    {
        value: 'deadlineClosedTasks',
        head: i18next.t('task.status.header.deadline'),
        content: (
            <TaskListContent orderStatus={TASK_STATUSES.DEADLINE_CLOSED} />
        ),
        count: -1,
    },
    {
        value: 'needWorkTasks',
        head: i18next.t('task.status.need-work'),
        content: <TaskListContent orderStatus={TASK_STATUSES.NEED_WORK} />,
        count: -1,
    },
]

export default function TaskListPage() {
    const { data: orders = { count: 0, data: [] }, refetch } =
        useGetPersonalOrdersQuery(placeholderQuery)
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
            <CustomTabs tabs={tasksPageTabs(orders.count)} />
        </PageLayout>
    )
}
