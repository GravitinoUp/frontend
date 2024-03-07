import { TASK_STATUSES_STYLES } from '@/constants/style-constants'

export const getCellTextColor = (columnId: string) => {
    switch (columnId) {
        case 'id':
            return 'text-body-light'
        default:
            return 'text-base'
    }
}

export const getCellAlignment = (columnId: string) =>
    columnId === 'actions' ? 'text-end' : ''

export const getStatusCellClass = (value: string) => {
    const statusColorStyles = TASK_STATUSES_STYLES[value.toLowerCase()]
    return `block text-center rounded-lg py-1.5 px-4 ${
        statusColorStyles || 'bg-[#F0F0F2]'
    }`
}
