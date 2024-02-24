import { useState } from 'react'
import { rolesTableColumns } from './roles-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { placeholderQuery } from '@/pages/tasklist/constants'
import { useGetRolesQuery } from '@/redux/api/roles'
import { RolesPayloadInterface } from '@/types/interface/roles'

const RolesTab = () => {
    const [rolesQuery, setRolesQuery] = useState<RolesPayloadInterface>({
        ...placeholderQuery,
        sorts: { role_id: 'ASC' },
    })

    const {
        data: roles = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetRolesQuery(rolesQuery)

    if (isError) {
        return <CustomAlert />
    }

    return (
        <DataTable
            data={roles.data}
            columns={rolesTableColumns}
            getPaginationInfo={(pageSize, pageIndex) => {
                setRolesQuery({
                    ...rolesQuery,
                    offset: { count: pageSize, page: pageIndex + 1 },
                })
            }}
            paginationInfo={{
                itemCount: roles.count,
                pageSize: rolesQuery.offset.count,
            }}
            isLoading={isLoading}
        />
    )
}

export default RolesTab
