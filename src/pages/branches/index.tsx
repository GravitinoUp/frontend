import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { branchesColumns } from './branches-columns'
import { branchesFormTab } from './branches-form-tab'
import { placeholderQuery } from '../tasklist/constants.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { BranchesPayloadInterface } from '@/types/interface/branch'
import { getColumnSorts } from '@/utils/helpers'

const BranchesPage = () => {
    const [branchesQuery, setBranchesQuery] =
        useState<BranchesPayloadInterface>({
            ...placeholderQuery,
        })

    const {
        data: branches = { count: 0, data: [] },
        error,
        isLoading,
        refetch,
    } = useGetBranchesQuery(branchesQuery)

    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('branches')}
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
                        <CustomTabs
                            tabs={branchesFormTab()}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
            rightBlock={
                <div>
                    <div className="h-16" />
                    <div className="flex gap-3 mb-3">
                        <ExcelButton buttonType="export" onClick={() => {}} />
                        <ExcelButton buttonType="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            {error ? (
                <ErrorCustomAlert error={error} />
            ) : (
                <DataTable
                    data={branches.data}
                    columns={branchesColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting) => {
                        const sorts = getColumnSorts(sorting)

                        setBranchesQuery({
                            ...branchesQuery,
                            sorts,
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    paginationInfo={{
                        itemCount: branches.count,
                        pageSize: branchesQuery.offset.count,
                    }}
                    isLoading={isLoading}
                />
            )}
        </PageLayout>
    )
}

export default BranchesPage
