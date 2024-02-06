import { useState } from 'react'
import { organizationFormTab } from './organization-form-tab'
import { organizationsColumns } from './organizations-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
import { OrganizationsPayloadInterface } from '@/types/interface/organizations'

const OrganizationsPage = () => {
    const organizationsQuery: OrganizationsPayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
    }

    const {
        data: organizations = [],
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
                data={organizations}
                columns={organizationsColumns}
                hasBackground
            />
        </PageLayout>
    )
}

export default OrganizationsPage
