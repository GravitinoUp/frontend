import { getStatusCellClass } from '../data-table/get-cell-class'
import { TASK_STATUSES } from '@/constants/constants'
import CancelStatusTooltip from '@/pages/tasklist/cancel-status-tooltip'

interface OrderStatusProps {
    status: string
}

const OrderStatus = ({ status }: OrderStatusProps) => {
    const className = getStatusCellClass(status)
    const isWorkNeeded = status.toLowerCase() === TASK_STATUSES.NEED_WORK

    return (
        <div className="flex justify-end">
            {isWorkNeeded && <CancelStatusTooltip />}
            <span className={className}>{status}</span>
        </div>
    )
}

export default OrderStatus
