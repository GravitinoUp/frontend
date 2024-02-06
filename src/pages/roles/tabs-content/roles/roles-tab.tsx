import { rolesTableColumns } from './roles-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetRolesQuery } from '@/redux/api/roles'
import { RolesPayloadInterface } from '@/types/interface/roles'

const RolesTab = () => {
    const rolesQuery: RolesPayloadInterface = {
        offset: {
            count: 50,
            page: 1
        },
        filter: {},
        sorts: {},
    };

    const { data: roles = [], isError, isLoading } = useGetRolesQuery(rolesQuery)

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return <CustomAlert />
    }

    return <DataTable data={roles} columns={rolesTableColumns} />
}

export default RolesTab
