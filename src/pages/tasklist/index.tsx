import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddTaskForm from './add-task-form'
import ExportForm from './export-form'
import ImportForm from './import-form'
import TaskListContent from './tasklist-content'
import CalendarForm from '@/components/calendar-form/calendar-form'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetAllOrderStatusesQuery } from '@/redux/api/order-statuses.ts'

export default function TaskListPage() {
    const { t } = useTranslation()

    const [formOpen, setFormOpen] = useState(false)
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    const { data: orderStatuses = [], refetch } = useGetAllOrderStatusesQuery()

    const tasksPageTabs = orderStatuses.map((value) => ({
        value: `${value.order_status_id}`,
        head: value.order_status_name,
        content: <TaskListContent orderStatus={value.order_status_name} />,
        count: value.order_count,
    }))

    const totalCount = orderStatuses.reduce(
        (result, value) => result + value.order_count,
        0
    )
    tasksPageTabs.unshift({
        value: 'allTasks',
        head: t('all'),
        content: <TaskListContent />,
        count: totalCount,
    })

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
