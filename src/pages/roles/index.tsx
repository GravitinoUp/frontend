import { useState } from 'react'
import { roleFormTab } from './tabs-content/roles/role-form-tab'
import RolesTab from './tabs-content/roles/roles-tab'
import { placeholderQuery } from '../tasklist/constants'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'

import { useGetRolesQuery } from '@/redux/api/roles'

const rolesPageTabs = [
    {
        value: 'roles',
        head: 'Роли',
        content: <RolesTab />,
    },
    {
        value: 'accessMap',
        head: 'Карта доступов',
        content: <p>Access placeholder</p>,
    },
    {
        value: 'permissionsList',
        head: 'Список прав',
        content: <p>Permissions placeholder</p>,
    },
]

const RolesPage = () => {
    const { refetch } = useGetRolesQuery(placeholderQuery)
    const [formOpen, setFormOpen] = useState(false)

    return (
        <PageLayout
            title="Роли"
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
                        <CustomTabs
                            tabs={roleFormTab()}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
        >
            <CustomTabs tabs={rolesPageTabs} />
        </PageLayout>
    )
}

export default RolesPage
