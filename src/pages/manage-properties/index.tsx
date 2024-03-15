import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    managePropertiesFormTab,
    managePropertiesPageTab,
} from './manage-properties-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
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
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
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
