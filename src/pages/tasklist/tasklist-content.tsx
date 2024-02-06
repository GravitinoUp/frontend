import { useNavigate } from 'react-router-dom'
import { tasksColumns } from './tasks-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders'
import { OrderMyPayloadInterface } from '@/types/interface/orders'

function TaskListContent() {
    const navigate = useNavigate()

    const personalOrdersQuery: OrderMyPayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
        period: {
            date_start: '2024-01-01',
            date_end: '2024-01-26',
        },
    }

    const {
        data = [],
        isError,
        isLoading,
    } = useGetPersonalOrdersQuery(personalOrdersQuery)

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
        <DataTable
            data={formattedTasks}
            columns={tasksColumns}
            onRowClick={(rowData) =>
                navigate(`task`, {
                    state: {
                        order: data.find((e) => e.order_id === rowData.id),
                    },
                })
            }
        />
    )
}

export default TaskListContent
