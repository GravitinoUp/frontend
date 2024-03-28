import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { branchesColumns } from './branches-columns'
import { branchesFormTab } from './branches-form-tab'
import ExportForm from '../../components/form/export-form.tsx'
import ImportForm from '../../components/form/import-form.tsx'
import { placeholderQuery } from '../tasklist/constants.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import ExcelButton from '@/components/excel-button/excel-button'
import { PageLayout } from '@/components/layout/page-layout.tsx'
import { PermissionEnum } from '@/constants/permissions.enum.ts'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { BranchesPayloadInterface } from '@/types/interface/branch'
import { getColumnSorts } from '@/utils/helpers'

const BranchesPage = () => {
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    const [branchesQuery, setBranchesQuery] =
        useState<BranchesPayloadInterface>({
            ...placeholderQuery,
        })

    const {
        data: branches = { count: 0, data: [] },
        error,
        isFetching,
        refetch,
    } = useGetBranchesQuery(branchesQuery)

    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('branches')}
            onRefreshClick={refetch}
            isLoading={isFetching}
            actionButton={
                <DialogWindow
                    open={formOpen}
                    setOpen={setFormOpen}
                    content={
                        <CustomTabs
                            tabs={branchesFormTab()}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
            actionButtonPermissions={[PermissionEnum.BranchCreate]}
            rightBlock={
                <div>
                    <div className="h-16" />
                    <div className="flex gap-3 mb-3">
                        <DialogWindow
                            open={exportFormOpen}
                            setOpen={setExportFormOpen}
                            trigger={<ExcelButton buttonType="export" />}
                            content={<ExportForm />}
                        />
                        <DialogWindow
                            open={importFormOpen}
                            setOpen={setImportFormOpen}
                            trigger={<ExcelButton buttonType="import" />}
                            triggerPermissions={[PermissionEnum.BranchCreate]}
                            content={<ImportForm type="branch" />}
                        />
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
                    getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                        const sorts = getColumnSorts(sorting)

                        setBranchesQuery({
                            ...branchesQuery,
                            sorts,
                            filter: {
                                ...branchesQuery.filter,
                                branch_name: filter,
                            },
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    paginationInfo={{
                        itemCount: branches.count,
                        pageSize: branchesQuery.offset.count,
                        pageIndex: branchesQuery.offset.page - 1,
                    }}
                    isLoading={isFetching}
                    searchPlaceholder={t('search.branch.name')}
                />
            )}
        </PageLayout>
    )
}

export default BranchesPage
