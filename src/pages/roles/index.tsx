import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { roleFormTab } from './tabs-content/roles/role-form-tab'
import RolesTab from './tabs-content/roles/roles-tab'
import i18next from '../../i18n.ts'
import { placeholderQuery } from '../tasklist/constants.ts'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
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
    const { refetch, isFetching } = useGetRolesQuery(placeholderQuery)
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('roles')}
            onRefreshClick={refetch}
            isLoading={isFetching}
            actionButton={
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    content={
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
