import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { roleFormTab } from './tabs-content/roles/role-form-tab'
import RolesTab from './tabs-content/roles/roles-tab'
import i18next from '../../i18n.ts'
import { placeholderQuery } from '../tasklist/constants'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetRolesQuery } from '@/redux/api/roles'

const rolesPageTabs = [
    {
        value: 'roles',
        head: i18next.t('roles'),
        content: <RolesTab />,
    },
    {
        value: 'accessMap',
        head: i18next.t('tabs.access.map'),
        content: <p>Access placeholder</p>,
    },
    {
        value: 'permissionsList',
        head: i18next.t('tabs.permissions.list'),
        content: <p>Permissions placeholder</p>,
    },
]

const RolesPage = () => {
    const { refetch } = useGetRolesQuery(placeholderQuery)
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('roles')}
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
