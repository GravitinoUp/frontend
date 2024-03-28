import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddTaskForm from './components/add-task-form.tsx'
import { placeholderQuery } from './constants.ts'
import TaskListContent from './tasklist-content.tsx'
import ExportForm from '../../components/form/export-form.tsx'
import ImportForm from '../../components/form/import-form.tsx'
import DateRangeFilter from '@/components/calendar-form/date-range-filter.tsx'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import ExcelButton from '@/components/excel-button/excel-button'
import { PageLayout } from '@/components/layout/page-layout.tsx'
import { defaultQuery } from '@/constants/constants.ts'
import { PermissionEnum } from '@/constants/permissions.enum.ts'
import { TasksFilterQueryContext } from '@/context/tasks-filter-query.tsx'
import { useGetOrderStatusesQuery } from '@/redux/api/order-statuses.ts'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'

export default function TaskListPage() {
    const { t } = useTranslation()

    const [formOpen, setFormOpen] = useState(false)
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(
        TasksFilterQueryContext
    )
    const { refetch, isFetching } =
        useGetPersonalOrdersQuery(personalOrdersQuery)

    const { data: orderStatuses = [] } = useGetOrderStatusesQuery({
        ...placeholderQuery,
        period: personalOrdersQuery.period
            ? personalOrdersQuery.period
            : defaultQuery.period,
    })

    const tasksPageTabs = orderStatuses.map((value) => ({
        value: `${value.order_status_id}`,
        head: value.order_status_name,
        content: <TaskListContent orderStatus={value.order_status_id} />,
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
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    content={<AddTaskForm setDialogOpen={setFormOpen} />}
                />
            }
            actionButtonPermissions={[PermissionEnum.TaskCreate]}
            rightBlock={
                <div>
                    <DateRangeFilter
                        filterQuery={personalOrdersQuery}
                        setFilterQuery={setPersonalOrdersQuery}
                    />
                    <div className="flex gap-3">
                        <DialogWindow
                            open={exportFormOpen}
                            setOpen={setExportFormOpen}
                            trigger={<ExcelButton buttonType="export" />}
                            content={<ExportForm />}
                        />
                        <DialogWindow
                            open={importFormOpen}
                            setOpen={setImportFormOpen}
                            trigger={<ExcelButton buttonType="import" />}
                            triggerPermissions={[PermissionEnum.TaskCreate]}
                            content={<ImportForm type="order" />}
                        />
                    </div>
                </div>
            }
        >
            <CustomTabs
                tabs={tasksPageTabs}
                initialTab={
                    tasksPageTabs[
                        personalOrdersQuery.filter.order_status &&
                        personalOrdersQuery.filter.order_status.length === 1 &&
                        personalOrdersQuery.filter.order_status[0]
                            ?.order_status_id
                            ? personalOrdersQuery.filter.order_status[0]
                                  ?.order_status_id
                            : 0
                    ]
                }
            />
        </PageLayout>
    )
}
