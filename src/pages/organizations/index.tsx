import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { organizationsColumns } from './organizations-columns'
import { placeholderQuery } from '../tasklist/constants.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { PageLayout } from '@/components/PageLayout'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
import { OrganizationsPayloadInterface } from '@/types/interface/organizations'

const OrganizationsPage = () => {
    const { t } = useTranslation()

    const [organizationsQuery, setOrganizationsQuery] =
        useState<OrganizationsPayloadInterface>({
            ...placeholderQuery,
        })

    const {
        data: organizations = { count: 0, data: [] },
        error,
        isFetching,
        refetch,
    } = useGetAllOrganizationsQuery(organizationsQuery)

    return (
        <PageLayout
            title={t('organizations')}
            onRefreshClick={refetch}
            isLoading={isFetching}
        >
            {error ? (
                <ErrorCustomAlert error={error} />
            ) : (
                <DataTable
                    data={organizations.data}
                    columns={organizationsColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                        const sorts = sorting.reduce((acc, value) => {
                            const currentSortOrder = value.desc ? 'DESC' : 'ASC'

                            if (
                                value.id ===
                                'organization_type_organization_type_name'
                            ) {
                                return {
                                    ...acc,
                                    organization_type: {
                                        organization_type_name:
                                            currentSortOrder,
                                    },
                                }
                            } else {
                                return {
                                    ...acc,
                                    [`${value.id}`]: currentSortOrder,
                                }
                            }
                        }, {})

                        setOrganizationsQuery({
                            ...organizationsQuery,
                            sorts,
                            filter: {
                                ...organizationsQuery.filter,
                                full_name: filter,
                            },
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    paginationInfo={{
                        itemCount: organizations.count,
                        pageSize: organizationsQuery.offset.count,
                    }}
                    isLoading={isFetching}
                />
            )}
        </PageLayout>
    )
}

export default OrganizationsPage
