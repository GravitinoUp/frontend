import { useState } from 'react'
import { branchesColumns } from './branches-columns'
import { branchesFormTab } from './branches-form-tab'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { BranchesPayloadInterface } from '@/types/interface/branch'

const BranchesPage = () => {
    const [branchesQuery, setBranchesQuery] =
        useState<BranchesPayloadInterface>({
            ...placeholderQuery,
            sorts: { branch_id: 'ASC' },
        })

    const {
        data: branches = { count: 0, data: [] },
        isError,
        isLoading,
        refetch,
    } = useGetBranchesQuery(branchesQuery)

    const [formOpen, setFormOpen] = useState(false)

    return (
        <PageLayout
            title="Филиалы"
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
                    <div className="h-16 mb-7" />
                    <div className="flex gap-3 mb-10">
                        <ExcelButton buttonType="export" onClick={() => {}} />
                        <ExcelButton buttonType="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            {isLoading && <LoadingSpinner />}
            {isError && <CustomAlert />}
            <DataTable
                data={branches.data}
                columns={branchesColumns}
                hasBackground
                getPaginationInfo={(pageSize, pageIndex) => {
                    setBranchesQuery({
                        ...branchesQuery,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                paginationInfo={{
                    itemCount: branches.count,
                    pageSize: branchesQuery.offset.count,
                }}
            />
        </PageLayout>
    )
}

export default BranchesPage
