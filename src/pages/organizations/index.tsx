import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { organizationFormTab } from './organization-form-tab'
import { organizationsColumns } from './organizations-columns'
import { placeholderQuery } from '../tasklist/constants.ts'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
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
    const { t } = useTranslation()

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
            {isError
                ? <CustomAlert />
                : <DataTable
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
                    isLoading={isLoading}
                />
            }
        </PageLayout>
    )
}

export default OrganizationsPage
