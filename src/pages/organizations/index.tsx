import { useState } from 'react'
import { organizationFormTab } from './organization-form-tab'
import { organizationsColumns } from './organizations-columns'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
import { OrganizationsPayloadInterface } from '@/types/interface/organizations'

const OrganizationsPage = () => {
    const [organizationsQuery, setOrganizationsQuery] =
        useState<OrganizationsPayloadInterface>({
            ...placeholderQuery,
            sorts: { organization_id: 'ASC' },
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
            title="Организации"
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
            {isLoading && <LoadingSpinner />}
            {isError && <CustomAlert />}
            <DataTable
                data={organizations.data}
                columns={organizationsColumns}
                hasBackground
                getPaginationInfo={(pageSize, pageIndex) => {
                    setOrganizationsQuery({
                        ...organizationsQuery,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                paginationInfo={{
                    itemCount: organizations.count,
                    pageSize: organizationsQuery.offset.count,
                }}
            />
        </PageLayout>
    )
}

export default OrganizationsPage
