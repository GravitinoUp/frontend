import { format } from 'date-fns'

export const getJWTtokens = () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    return {
        accessToken,
        refreshToken,
    }
}

// для форматирования даты с бэкенда в привычный формат. 2024-01-11T10:36:59.321Z ---> 11.01.2024
export const formatDate = (date?: Date | null) => {
    if (!date) {
        return ''
    }
    const newDate = new Date(date)
    const formattedDate = format(newDate, 'dd.MM.yyyy')

    return formattedDate
}

export const formatInitials = (
    firstName: string,
    lastName: string,
    patronymic: string
) => {
    const str = `${lastName} ${firstName} ${patronymic}`

    return str
        .split(/\s+/)
        .map((w, i) => (i ? w.substring(0, 1).toUpperCase() + '.' : w))
        .join(' ')
}
