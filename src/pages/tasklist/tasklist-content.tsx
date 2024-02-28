import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { initialColumnVisibility, placeholderQuery } from './constants'
import TaskFiltersForm from './task-filters-form'
import { tasksColumns, TasksFilterColumns } from './tasks-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import FormDialog from '@/components/form-dialog/form-dialog'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'
import { OrderPayloadInterface } from '@/types/interface/orders'
import { formatDate, formatInitials } from '@/utils/helpers'

function TaskListContent() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [personalOrdersQuery, setPersonalOrdersQuery] =
        useState<OrderPayloadInterface>(placeholderQuery)

    const [filterColumns, setFilterColumns] = useState<TasksFilterColumns>(
        initialColumnVisibility
    )

    const {
        data = { count: 0, data: [] },
        isError,
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
                    let sorts = {}
                    sorting.forEach((value) => {
                        const desc = value.desc ? 'DESC' : 'ASC'

                        switch (value.id) {
                            case 'facility_name':
                                sorts = {
                                    ...sorts,
                                    facility: {
                                        [`${value.id}`]: desc,
                                    },
                                }
                                break
                            case 'checkpoint_name':
                                sorts = {
                                    ...sorts,
                                    facility: {
                                        checkpoint: {
                                            [`${value.id}`]: desc,
                                        },
                                    },
                                }
                                break
                            case 'branch_name':
                                sorts = {
                                    ...sorts,
                                    facility: {
                                        checkpoint: {
                                            branch: { [`${value.id}`]: desc },
                                        },
                                    },
                                }
                                break
                            case 'executor':
                                sorts = {
                                    ...sorts,
                                    executor: {
                                        short_name: desc,
                                    },
                                }
                                break
                            case 'creator':
                                sorts = {
                                    ...sorts,
                                    creator: {
                                        person: {
                                            last_name: desc,
                                            first_name: desc,
                                            patronymic: desc,
                                        },
                                    },
                                }
                                break
                            case 'priority_name':
                                sorts = {
                                    ...sorts,
                                    priority: {
                                        [`${value.id}`]: desc,
                                    },
                                }
                                break
                            case 'deliveryDate':
                                sorts = {
                                    ...sorts,
                                    planned_datetime: desc,
                                    task_end_datetime: desc,
                                }
                                break
                            case 'order_status_name':
                                sorts = {
                                    ...sorts,
                                    order_status: {
                                        order_status_id: desc,
                                    },
                                }
                                break
                            case 'taskType':
                                sorts = {
                                    ...sorts,
                                    task: {
                                        task_id: desc,
                                    },
                                }
                                break
                            default:
                                sorts = {
                                    ...sorts,
                                    [`${value.id}`]: desc,
                                }
                                break
                        }
                    })

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
