import { useState } from 'react'
import { managePropertiesColumns } from './manage-properties-columns'
import { placeholderQuery } from '../tasklist/constants.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { useGetPropertiesQuery } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'
import { PropertyPayloadInterface } from '@/types/interface/properties'
import { getColumnSorts } from '@/utils/helpers'

interface ManagePropertiesContentProps {
    entity: EntityType
}

function ManagePropertiesContent({ entity }: ManagePropertiesContentProps) {
    const [propertiesQuery, setPropertiesQuery] =
        useState<PropertyPayloadInterface>(placeholderQuery)

    const {
        data: properties = { count: 0, data: [] },
        error,
        isLoading,
    } = useGetPropertiesQuery(entity)

    if (error) {
        return <ErrorCustomAlert error={error} />
    }

    return (
        <DataTable
            data={properties.data}
            columns={managePropertiesColumns}
            getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                const sorts = getColumnSorts(sorting)

                setPropertiesQuery({
                    ...propertiesQuery,
                    sorts,
                    filter: {
                        ...propertiesQuery.filter,
                        property_name: filter,
                    },
                    offset: { count: pageSize, page: pageIndex + 1 },
                })
            }}
            paginationInfo={{
                itemCount: properties.count,
                pageSize: propertiesQuery.offset.count,
                pageIndex: propertiesQuery.offset.page - 1,
            }}
            isLoading={isLoading}
        />
    )
}

export default ManagePropertiesContent
