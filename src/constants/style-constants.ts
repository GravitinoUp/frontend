import { TASK_STATUSES } from './constants'

const {
    IN_PROGRESS,
    CLOSED,
    CANCELED,
    APPOINTED,
    DEADLINE_CLOSED,
    ON_VERIFICATION,
} = TASK_STATUSES

export const TASK_STATUSES_STYLES = {
    [IN_PROGRESS]: 'bg-status-in-progress text-[#8B63E7]',
    [CLOSED]: 'bg-status-closed text-[#20A144]',
    [CANCELED]: 'bg-status-canceled text-[#FF6B6B]',
    [APPOINTED]: 'bg-status-appointed text-[#0784D1]',
    [ON_VERIFICATION]: 'bg-status-verification text-[#FFD240]',
    [DEADLINE_CLOSED]: 'bg-status-canceled text-[#FF6B6B]',
}
