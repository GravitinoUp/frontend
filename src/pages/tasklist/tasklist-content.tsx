import { Fragment, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import TaskFiltersForm from './components/task-filters-form.tsx'
import { initialColumnVisibility } from './constants.ts'
import { tasksColumns, TasksFilterColumns } from './tasks-columns.tsx'
import { CustomAlert } from '@/components/custom-alert/custom-alert.tsx'
import DataTable from '@/components/data-table/data-table.tsx'
import FormDialog from '@/components/form-dialog/form-dialog.tsx'
import { TasksFilterQueryContext } from '@/context/tasks/tasks-filter-query.tsx'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders.ts'
import { formatDate } from '@/utils/helpers.ts'

function TaskListContent() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [filterColumns, setFilterColumns] = useState<TasksFilterColumns>(
        initialColumnVisibility,
    )

    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(TasksFilterQueryContext)
    const {
        data = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetPersonalOrdersQuery(personalOrdersQuery)

    const [formOpen, setFormOpen] = useState(false)

    const formattedTasks = data.data.map((row) => ({
        key: row.order_id,
        id: row.order_id,
        facility: row.facility.facility_name,
        checkpoint: row.facility.checkpoint.checkpoint_name,
        taskDescription: row.order_description || '',
        status: row.order_status?.order_status_name,
        taskName: row.order_name || '',
        priorityStatus: row.priority.priority_name,
        executor: row.executor.short_name,
        branch: row.facility.checkpoint.branch.branch_name,
        taskCreator: `${row.creator?.person.last_name} ${row.creator?.person.first_name} ${row.creator?.person.patronymic}`,
        taskType: row.task.task_id,
        closeDate: formatDate(row.ended_at_datetime) || '',
        deliveryDate: `${formatDate(row.planned_datetime)}-${formatDate(
            row.task_end_datetime,
        )}`,
    }))

    if (isError) {
        return <CustomAlert />
    }

    return (
        <Fragment>
            <FormDialog
                open={formOpen}
                setOpen={setFormOpen}
                actionButton={<Fragment />}
                size="md"
                headerContent={
                    <h2 className="text-3xl font-semibold text-black">
                        {t('choose.filters')}
                    </h2>
                }
                addItemForm={
                    <TaskFiltersForm
                        handleSubmit={(data) => {
                            setPersonalOrdersQuery({
                                ...personalOrdersQuery,
                                filter: {
                                    facility: {
                                        checkpoint: {
                                            checkpoint_id:
                                                data.checkpoint_id !== 0
                                                    ? data.checkpoint_id
                                                    : undefined,
                                            branch: {
                                                branch_id:
                                                    data.branch_id !== 0
                                                        ? data.branch_id
                                                        : undefined,
                                            },
                                        },
                                    },
                                    executor: {
                                        organization_id:
                                            data.organization_id !== 0
                                                ? data.organization_id
                                                : undefined,
                                    },
                                    priority: {
                                        priority_id:
                                            data.priority_id !== 0
                                                ? data.priority_id
                                                : undefined,
                                    },
                                    order_status: data.order_status.map(
                                        (value) => ({
                                            order_status_name: value,
                                        }),
                                    ),
                                },
                            })

                            setFilterColumns(data.columns)

                            setFormOpen(false)
                        }}
                        data={{
                            branch_id:
                            personalOrdersQuery.filter.facility?.checkpoint
                                ?.branch?.branch_id,
                            checkpoint_id:
                            personalOrdersQuery.filter.facility?.checkpoint
                                ?.checkpoint_id,
                            organization_id:
                            personalOrdersQuery.filter.executor
                                ?.organization_id,
                            priority_id:
                            personalOrdersQuery.filter.priority
                                ?.priority_id,
                            order_status: personalOrdersQuery.filter
                                .order_status
                                ? personalOrdersQuery.filter.order_status!.map(
                                    (value) => `${value?.order_status_name}`,
                                )
                                : [],
                            columns: filterColumns,
                        }}
                    />
                }
            />
            <DataTable
                data={formattedTasks}
                columns={tasksColumns}
                columnVisibility={filterColumns}
                getPaginationInfo={(pageSize, pageIndex) => {
                    setPersonalOrdersQuery({
                        ...personalOrdersQuery,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                onRowClick={(rowData) =>
                    navigate(`task`, {
                        state: {
                            order: data.data.find(
                                (e) => e.order_id === rowData.id,
                            ),
                        },
                    })
                }
                searchSuffixIconClick={() => setFormOpen(true)}
                paginationInfo={{
                    itemCount: data.count,
                    pageSize: personalOrdersQuery.offset.count,
                }}
                isLoading={isLoading}
            />
        </Fragment>
    )
}

export default TaskListContent
