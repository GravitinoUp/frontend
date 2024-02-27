import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { organizationFormTab } from './organization-form-tab'
import { organizationsColumns } from './organizations-columns'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import FormDialog from '@/components/form-dialog/form-dialog'
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
        isError,
        isLoading,
        refetch,
    } = useGetAllOrganizationsQuery(organizationsQuery)

    const [formOpen, setFormOpen] = useState(false)

    return (
        <PageLayout
            title={t('organizations')}
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
                        <CustomTabs
                            tabs={organizationFormTab()}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
        >
            {isError ? (
                <CustomAlert />
            ) : (
                <DataTable
                    data={organizations.data}
                    columns={organizationsColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting) => {
                        let sorts = {}
                        sorting.forEach((value) => {
                            const desc = value.desc ? 'DESC' : 'ASC'

                            if (
                                value.id ===
                                'organization_type_organization_type_name'
                            ) {
                                sorts = {
                                    ...sorts,
                                    organization_type: {
                                        organization_type_name: desc,
                                    },
                                }
                            } else {
                                sorts = {
                                    ...sorts,
                                    [`${value.id}`]: desc,
                                }
                            }
                        })

                        setOrganizationsQuery({
                            ...organizationsQuery,
                            sorts: sorts,
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    paginationInfo={{
                        itemCount: organizations.count,
                        pageSize: organizationsQuery.offset.count,
                    }}
                    isLoading={isLoading}
                />
            )}
        </PageLayout>
    )
}

export default OrganizationsPage
