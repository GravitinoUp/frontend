import { managePropertiesColumns } from './manage-properties-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetPropertiesQuery } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'

interface ManagePropertiesContentProps {
    entity: EntityType
}

function ManagePropertiesContent({ entity }: ManagePropertiesContentProps) {
    const {
        data = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetPropertiesQuery({ entity_name: entity })

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return <CustomAlert />
    }

    return <DataTable data={data.data} columns={managePropertiesColumns} />
}

export default ManagePropertiesContent
