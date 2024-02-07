import { useState } from 'react'
import {
    managePropertiesFormTab,
    managePropertiesPageTab,
} from './manage-properties-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetPropertyNamesQuery } from '@/redux/api/properties'

export default function ManagePropertiesPage() {
    const { refetch } = useGetPropertyNamesQuery()

    const [formOpen, setFormOpen] = useState(false)

    return (
        <PageLayout
            title="Управление характеристиками"
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
                        <CustomTabs
                            tabs={managePropertiesFormTab}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
            rightBlock={
                <div>
                    <div className="h-16 " />
                    <div className="flex gap-3 mb-3">
                        <ExcelButton type="export" onClick={() => {}} />
                        <ExcelButton type="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            <CustomTabs tabs={managePropertiesPageTab} />
        </PageLayout>
    )
}
