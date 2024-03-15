import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddTaskForm from './components/add-task-form.tsx'
import ExportForm from '../../components/form/export-form.tsx'
import ImportForm from '../../components/form/import-form.tsx'
import TaskListContent from './tasklist-content.tsx'
import DateRangeFilter from '@/components/calendar-form/date-range-filter.tsx'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { TasksFilterQueryContext } from '@/context/tasks/tasks-filter-query.tsx'
import { useGetAllOrderStatusesQuery } from '@/redux/api/order-statuses.ts'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'

export default function TaskListPage() {
    const { t } = useTranslation()

    const [formOpen, setFormOpen] = useState(false)
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    const { data: orderStatuses = [] } = useGetAllOrderStatusesQuery()

    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(
        TasksFilterQueryContext
    )
    const { refetch, isFetching } =
        useGetPersonalOrdersQuery(personalOrdersQuery)

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
            isLoading={isFetching}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={<AddTaskForm setDialogOpen={setFormOpen} />}
                />
            }
            rightBlock={
                <div>
                    <DateRangeFilter
                        filterQuery={personalOrdersQuery}
                        setFilterQuery={setPersonalOrdersQuery}
                    />
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
                            addItemForm={<ImportForm type="order" />}
                        />
                    </div>
                </div>
            }
        >
            <CustomTabs tabs={tasksPageTabs} />
        </PageLayout>
    )
}
