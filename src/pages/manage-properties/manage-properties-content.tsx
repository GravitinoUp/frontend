import { useState } from 'react'
import { managePropertiesColumns } from './manage-properties-columns'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetPropertiesQuery } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'
import { PropertyPayloadInterface } from '@/types/interface/properties'

interface ManagePropertiesContentProps {
    entity: EntityType
}

function ManagePropertiesContent({ entity }: ManagePropertiesContentProps) {
    const [propertiesQuery, setPropertiesQuery] =
        useState<PropertyPayloadInterface>(placeholderQuery)

    const {
        data: properties = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetPropertiesQuery(entity)

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return <CustomAlert />
    }

    return (
        <DataTable
            data={properties.data}
            columns={managePropertiesColumns}
            getPaginationInfo={(pageSize, pageIndex) => {
                setPropertiesQuery({
                    ...propertiesQuery,
                    offset: { count: pageSize, page: pageIndex + 1 },
                })
            }}
            paginationInfo={{
                itemCount: properties.count,
                pageSize: propertiesQuery.offset.count,
            }}
        />
    )
}

export default ManagePropertiesContent
