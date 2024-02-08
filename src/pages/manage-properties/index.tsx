import { useState } from 'react'
import {
    managePropertiesFormTab,
    managePropertiesPageTab,
} from './manage-properties-tab'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetPropertiesQuery } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'

export default function ManagePropertiesPage() {
    const [formOpen, setFormOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState<EntityType>('Users')

    const { refetch } = useGetPropertiesQuery(currentPage)

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
                            tabs={managePropertiesFormTab(currentPage)}
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
            <CustomTabs
                tabs={managePropertiesPageTab}
                getCurrentPage={(value) => setCurrentPage(value as EntityType)}
            />
        </PageLayout>
    )
}
