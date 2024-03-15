import { SortingState } from '@tanstack/react-table'
import { format } from 'date-fns'
import { FILE_SIZE_UNITS } from '@/constants/constants.ts'
import { FormattedPermissionInterface } from '@/types/interface/roles'

export const getJWTtokens = () => {
    const accessToken = getCookieValue('accessToken')
    const refreshToken = getCookieValue('refreshToken')

    return {
        accessToken,
        refreshToken,
    }
}

// для форматирования даты с бэкенда в привычный формат. 2024-01-11T10:36:59.321Z ---> 11.01.2024
export const formatDate = (
    date?: string | Date | null,
    includeTime?: boolean
) => {
    if (!date) {
        return ''
    }
    const newDate = new Date(date)
    return format(newDate, `dd.MM.yyyy${includeTime ? ' hh:mm' : ''}`)
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

export const formatFileSize = (sizeInBytes: number) => {
    let i = 0
    let formattedSize = sizeInBytes

    const byteUnits = Object.values(FILE_SIZE_UNITS)

    while (formattedSize > 1024 && i < 3) {
        formattedSize /= 1024
        i++
    }

    return `${formattedSize.toFixed(i !== 0 ? 2 : 0)} ${byteUnits[i]}`
}

export const getColumnSorts = (sorting: SortingState) =>
    sorting.reduce(
        (acc, value) => ({
            ...acc,
            [`${value.id}`]: value.desc ? 'DESC' : 'ASC',
        }),
        {}
    )

export const getCookieValue = (key: string) => {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`))
        ?.split('=')[1]

    return cookieValue
}

export const removeCookieValue = (key: string) => {
    document.cookie = `${key}=; Max-Age=-1`
}

export const formatStringFilter = (value?: string) =>
    value?.trim() !== '' ? value : undefined

export const getPermissionValue = (permission_sku_list: string[]) => {
    const jsonPermissions = localStorage.getItem('permissions')

    if (jsonPermissions) {
        const permissions: FormattedPermissionInterface[] = JSON.parse(
            localStorage.getItem('permissions')!
        )

        const permissionValue = permissions.find(
            (p) =>
                (p.permission_sku === 'admin' && p.rights) ||
                (permission_sku_list.includes(p.permission_sku) && p.rights)
        )

        return permissionValue || permission_sku_list.length === 0
            ? true
            : false
    } else {
        return false
    }
}

/**
 * @param permission - Разрешение на получение всех элементов сущности (Например, order-get)
 * @returns all или my в зависимости от разрешения
 */
export const formatQueryEndpoint = (permission: string) =>
    getPermissionValue([permission]) ? 'all' : 'my'
