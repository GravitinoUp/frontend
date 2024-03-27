import { Fragment, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { EditTaskForm } from './components/edit-task-form.tsx'
import TaskFiltersForm, {
    TasksFilterColumns,
} from './components/task-filters-form.tsx'
import { initialColumnVisibility } from './constants.ts'
import { tasksColumns } from './tasks-columns.tsx'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table.tsx'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import { PermissionEnum } from '@/constants/permissions.enum.ts'
import { TasksFilterQueryContext } from '@/context/tasks/tasks-filter-query.tsx'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders.ts'
import { OrderInterface } from '@/types/interface/orders/index.ts'
import { formatDate, formatInitials } from '@/utils/helpers.ts'

const columnsFilters = localStorage.getItem('filterColumns')

function TaskListContent({ orderStatus }: { orderStatus?: number }) {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [filterColumns, setFilterColumns] = useState<TasksFilterColumns>(
        columnsFilters !== null
            ? JSON.parse(columnsFilters)
            : initialColumnVisibility
    )

    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(
        TasksFilterQueryContext
    )

    const {
        data = { count: 0, data: [] },
        error,
        isFetching,
    } = useGetPersonalOrdersQuery(personalOrdersQuery)

    const [filterFormOpen, setFilterFormOpen] = useState(false)
    const [editFormOpen, setEditFormOpen] = useState(false)

    const [selectedOrder, setSelectedOrder] = useState<
        OrderInterface | undefined
    >()

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
        creator:
            row.creator.user_id !== null
                ? formatInitials(
                      row.creator?.person.first_name,
                      row.creator?.person.last_name,
                      row.creator?.person.patronymic
                  )
                : t('user.guest'),
        taskType: row.task.task_id,
        periodicity: row.task.periodicity?.periodicity_name || '',
        ended_at_datetime: formatDate(row.ended_at_datetime) || '',
        deliveryDate: `${formatDate(row.planned_datetime)}-${formatDate(
            row.task_end_datetime
        )}`,
    }))

    useEffect(() => {
        localStorage.setItem('filterColumns', JSON.stringify(filterColumns))
    }, [filterColumns])

    useEffect(() => {
        if (
            (personalOrdersQuery.filter.order_status &&
                personalOrdersQuery.filter.order_status[0]?.order_status_id ===
                    orderStatus) ||
            (!personalOrdersQuery.filter.order_status && !orderStatus)
        ) {
            setPersonalOrdersQuery({
                ...personalOrdersQuery,
                filter: {
                    ...personalOrdersQuery.filter,
                    order_status: orderStatus
                        ? [{ order_status_id: orderStatus }]
                        : undefined,
                },
            })
        }
    }, [])

    if (error) {
        return <ErrorCustomAlert error={error} />
    }

    return (
        <Fragment>
            <DialogWindow
                open={editFormOpen}
                setOpen={setEditFormOpen}
                trigger={null}
                triggerPermissions={[PermissionEnum.TaskUpdate]}
                content={
                    <EditTaskForm
                        task={selectedOrder!}
                        setDialogOpen={setEditFormOpen}
                    />
                }
            />
            <DialogWindow
                open={filterFormOpen}
                setOpen={setFilterFormOpen}
                trigger={null}
                triggerPermissions={[PermissionEnum.TaskCreate]}
                size="lg"
                header={
                    <h2 className="text-3xl font-semibold text-black">
                        {t('choose.filters')}
                    </h2>
                }
                content={
                    <TaskFiltersForm
                        filtersData={{
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
                            columns: filterColumns,
                        }}
                        setFormOpen={setFilterFormOpen}
                        setFilterColumns={setFilterColumns}
                    />
                }
            />
            <DataTable
                data={formattedTasks}
                columns={tasksColumns}
                columnVisibility={filterColumns}
                getTableInfo={(pageSize, pageIndex, sorting, filter) => {
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
                        filter: {
                            ...personalOrdersQuery.filter,
                            order_status: orderStatus
                                ? [{ order_status_id: orderStatus }]
                                : undefined,
                            order_name: filter,
                        },
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                onRowClick={(rowData) => {
                    const orderData = data.data.find(
                        (e) => e.order_id === rowData.order_id
                    )
                    if (orderData?.order_status.order_status_id !== 9) {
                        navigate(`/tasklist/${orderData?.order_id}`)
                    } else {
                        setSelectedOrder(orderData)
                        setEditFormOpen(true)
                    }
                }}
                searchSuffixIconClick={() => setFilterFormOpen(true)}
                paginationInfo={{
                    itemCount: data.count,
                    pageSize: personalOrdersQuery?.offset?.count,
                    pageIndex: personalOrdersQuery?.offset?.page - 1,
                }}
                isLoading={isFetching}
                searchPlaceholder={t('search.order.name')}
            />
        </Fragment>
    )
}

export default TaskListContent
