import { SortingState } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ADMIN_ROLE_ID, FILE_SIZE_UNITS } from '@/constants/constants.ts'
import {
    FormattedPermissionInterface,
    RolePermissionInterface,
} from '@/types/interface/roles'
import { UserInterface } from '@/types/interface/user'

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
        .map((w, i) => (i && w ? w.substring(0, 1).toUpperCase() + '.' : w))
        .join(' ')
}

export const formatFileSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) {
        return ''
    }

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

        return !!(permissionValue || permission_sku_list.length === 0)
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

export const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1)

export const getCurrentColorScheme = () =>
    localStorage.getItem('colorScheme') || 'option-1'

export const setPermissions = (
    permissions: RolePermissionInterface[],
    user: UserInterface
) => {
    const formattedPermissions: FormattedPermissionInterface[] =
        permissions.map((value) => ({
            permission_name: value.permission.permission_name,
            permission_description: value.permission.permission_description,
            permission_sku: value.permission.permission_sku,
            rights: value.rights,
        }))

    formattedPermissions.unshift({
        permission_name: 'ADMIN',
        permission_description: '',
        permission_sku: 'admin',
        rights: user.role.role_id === ADMIN_ROLE_ID,
    })

    localStorage.setItem('permissions', JSON.stringify(formattedPermissions))
}

export const downloadFile = async (response: Response) => {
    if (response.ok) {
        const fileBlob = await response.blob()

        const url = window.URL.createObjectURL(new Blob([fileBlob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${response.url.split('/').pop()}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
