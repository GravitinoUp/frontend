import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    managePropertiesFormTab,
    managePropertiesPageTab,
} from './manage-properties-tab'
import ExportForm from '../tasklist/components/export-form'
import ImportForm from '../tasklist/components/import-form'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetPropertiesQuery } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'

export default function ManagePropertiesPage() {
    const [formOpen, setFormOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState<EntityType>('Users')
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    const { refetch } = useGetPropertiesQuery(currentTab)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('manage.properties')}
            onRefreshClick={refetch}
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
            rightBlock={
                <div>
                    <div className="h-16 " />
                    <FormDialog
                        open={exportFormOpen}
                        setOpen={setExportFormOpen}
                        actionButton={<ExcelButton buttonType="export" />}
                        addItemForm={<ExportForm />}
                    />
                    <FormDialog
                        open={importFormOpen}
                        setOpen={setImportFormOpen}
                        actionButton={<ExcelButton buttonType="import" />}
                        addItemForm={<ImportForm type="properties" />}
                    />
                </div>
            }
        >
            <CustomTabs
                tabs={managePropertiesPageTab}
                getCurrentPage={(value) => setCurrentTab(value as EntityType)}
            />
        </PageLayout>
    )
}
