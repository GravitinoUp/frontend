import { managePropertiesColumns } from './manage-properties-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetPropertyNamesQuery } from '@/redux/api/properties'

function ManageUserPropertiesContent() {
    const { data = [], isError, isLoading } = useGetPropertyNamesQuery()

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return <CustomAlert />
    }

    return <DataTable data={data} columns={managePropertiesColumns} />
}

export default ManageUserPropertiesContent
