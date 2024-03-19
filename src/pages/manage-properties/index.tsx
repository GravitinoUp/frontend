import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    managePropertiesFormTab,
    managePropertiesPageTab,
} from './manage-properties-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import { PageLayout } from '@/components/PageLayout'
import { PermissionEnum } from '@/constants/permissions.enum'
import { useGetPropertiesQuery } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'

export default function ManagePropertiesPage() {
    const [formOpen, setFormOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState<EntityType>('Users')

    const { refetch, isFetching } = useGetPropertiesQuery(currentTab)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('manage.properties')}
            onRefreshClick={refetch}
            isLoading={isFetching}
            actionButton={
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    content={
                        <CustomTabs
                            tabs={managePropertiesFormTab(currentTab)}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
        >
            <CustomTabs
                tabs={managePropertiesPageTab}
                getCurrentPage={(value) => setCurrentTab(value as EntityType)}
            />
        </PageLayout>
    )
}
