import { Fragment, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import TaskFiltersForm from './components/task-filters-form.tsx'
import { initialColumnVisibility } from './constants.ts'
import { tasksColumns, TasksFilterColumns } from './tasks-columns.tsx'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table.tsx'
import FormDialog from '@/components/form-dialog/form-dialog.tsx'
import { TasksFilterQueryContext } from '@/context/tasks/tasks-filter-query.tsx'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders.ts'
import { formatDate, formatInitials } from '@/utils/helpers.ts'

function TaskListContent() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [filterColumns, setFilterColumns] = useState<TasksFilterColumns>(
        initialColumnVisibility
    )

    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(
        TasksFilterQueryContext
    )
    const {
        data = { count: 0, data: [] },
        error,
        isLoading,
    } = useGetPersonalOrdersQuery(personalOrdersQuery)

    const [formOpen, setFormOpen] = useState(false)

    const formattedTasks = data.data.map((row) => ({
        key: row.order_id,
        order_id: row.order_id,
        facility_name: row.facility.facility_name,
        checkpoint_name: row.facility?.checkpoint?.checkpoint_name,
        order_name: row.order_name || '',
        order_description: row.order_description || '',
        order_status_name: row.order_status?.order_status_name,
        priority_name: row.priority.priority_name,
        executor: row.executor.short_name,
        branch_name: row.facility.checkpoint.branch.branch_name,
        creator: formatInitials(
            row.creator?.person.first_name,
            row.creator?.person.last_name,
            row.creator?.person.patronymic
        ),
        taskType: row.task.task_id,
        ended_at_datetime: formatDate(row.ended_at_datetime) || '',
        deliveryDate: `${formatDate(row.planned_datetime)}-${formatDate(
            row.task_end_datetime
        )}`,
    }))

    if (error) {
        return <ErrorCustomAlert error={error} />
    }

    return (
        <Fragment>
            <FormDialog
                open={formOpen}
                setOpen={setFormOpen}
                actionButton={<Fragment />}
                size="lg"
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
                                        })
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
                                      (value) => `${value?.order_status_name}`
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
                getTableInfo={(pageSize, pageIndex, sorting) => {
                    const sorts = sorting.reduce((acc, value) => {
                        const currentSortOrder = value.desc ? 'DESC' : 'ASC'

                        switch (value.id) {
                            case 'facility_name':
                                return {
                                    ...acc,
                                    facility: {
                                        [`${value.id}`]: currentSortOrder,
                                    },
                                }
                            case 'checkpoint_name':
                                return {
                                    ...acc,
                                    facility: {
                                        checkpoint: {
                                            [`${value.id}`]: currentSortOrder,
                                        },
                                    },
                                }
                            case 'branch_name':
                                return {
                                    ...acc,
                                    facility: {
                                        checkpoint: {
                                            branch: {
                                                [`${value.id}`]:
                                                    currentSortOrder,
                                            },
                                        },
                                    },
                                }
                            case 'executor':
                                return {
                                    ...acc,
                                    executor: {
                                        short_name: currentSortOrder,
                                    },
                                }
                            case 'creator':
                                return {
                                    ...acc,
                                    creator: {
                                        person: {
                                            last_name: currentSortOrder,
                                            first_name: currentSortOrder,
                                            patronymic: currentSortOrder,
                                        },
                                    },
                                }
                            case 'priority_name':
                                return {
                                    ...acc,
                                    priority: {
                                        [`${value.id}`]: currentSortOrder,
                                    },
                                }
                            case 'deliveryDate':
                                return {
                                    ...acc,
                                    planned_datetime: currentSortOrder,
                                    task_end_datetime: currentSortOrder,
                                }
                            case 'order_status_name':
                                return {
                                    ...acc,
                                    order_status: {
                                        order_status_id: currentSortOrder,
                                    },
                                }
                            case 'taskType':
                                return {
                                    ...acc,
                                    task: {
                                        task_id: currentSortOrder,
                                    },
                                }
                            default:
                                return {
                                    ...acc,
                                    [`${value.id}`]: currentSortOrder,
                                }
                        }
                    }, {})

                    setPersonalOrdersQuery({
                        ...personalOrdersQuery,
                        sorts,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                onRowClick={(rowData) =>
                    navigate(`task`, {
                        state: {
                            order: data.data.find(
                                (e) => e.order_id === rowData.order_id
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
