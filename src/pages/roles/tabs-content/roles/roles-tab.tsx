import { useState } from 'react'
import { rolesTableColumns } from './roles-columns'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { placeholderQuery } from '@/pages/tasklist/constants.ts'
import { useGetRolesQuery } from '@/redux/api/roles'
import { RolesPayloadInterface } from '@/types/interface/roles'
import { getColumnSorts } from '@/utils/helpers'

const RolesTab = () => {
    const [rolesQuery, setRolesQuery] = useState<RolesPayloadInterface>({
        ...placeholderQuery,
        sorts: { role_id: 'ASC' },
    })

    const {
        data: roles = { count: 0, data: [] },
        error,
        isFetching,
    } = useGetRolesQuery(rolesQuery)

    if (error) {
        return <ErrorCustomAlert error={error} />
    }

    return (
        <DataTable
            data={roles.data}
            columns={rolesTableColumns}
            getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                const sorts = getColumnSorts(sorting)

                setRolesQuery({
                    ...rolesQuery,
                    sorts,
                    filter: {
                        ...rolesQuery.filter,
                        role_name: filter,
                    },
                    offset: { count: pageSize, page: pageIndex + 1 },
                })
            }}
            paginationInfo={{
                itemCount: roles.count,
                pageSize: rolesQuery.offset.count,
                pageIndex: rolesQuery.offset.page - 1,
            }}
            isLoading={isFetching}
        />
    )
}

export default RolesTab
