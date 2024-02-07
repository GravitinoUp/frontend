import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { initialColumnVisibility } from './constants'
import TaskFiltersForm from './task-filters-form'
import { TasksFilterColumns, tasksColumns } from './tasks-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import FormDialog from '@/components/form-dialog/form-dialog'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'
import { OrderMyPayloadInterface } from '@/types/interface/orders'

function TaskListContent() {
    const navigate = useNavigate()

    const [personalOrdersQuery, setPersonalOrdersQuery] =
        useState<OrderMyPayloadInterface>({
            offset: {
                count: 10,
                page: 1,
            },
            filter: {},
            sorts: {},
            period: {
                date_start: '2024-01-01',
                date_end: '2025-01-01',
            },
        })

    const [filterColumns, setFilterColumns] = useState<TasksFilterColumns>(
        initialColumnVisibility
    )

    const {
        data = [],
        isLoading,
        isError,
    } = useGetPersonalOrdersQuery(personalOrdersQuery)

    const [formOpen, setFormOpen] = useState(false)

    const formattedTasks = data.map((row) => ({
        key: row.order_id,
        id: row.order_id,
        checkpoint: row.facility?.checkpoint?.checkpoint_name,
        taskDescription: row.task.task_description,
        status: row.order_status?.order_status_name,
        taskName: row.task.task_name,
        priorityStatus: row.priority.priority_name,
        executor: row.executor?.short_name,
        facility: row.facility?.facility_name,
        branch: row.facility.checkpoint.branch.branch_name,
    }))

    if (isLoading) {
        return <LoadingSpinner />
    }

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
                        Подобрать фильтры
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
                getPaginationInfo={(pageSize, pageIndex) => {
                    setPersonalOrdersQuery({
                        ...personalOrdersQuery,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                onRowClick={(rowData) =>
                    navigate(`task`, {
                        state: {
                            order: data.find((e) => e.order_id === rowData.id),
                        },
                    })
                }
                searchSuffixIconClick={() => setFormOpen(true)}
            />
        </Fragment>
    )
}

export default TaskListContent
