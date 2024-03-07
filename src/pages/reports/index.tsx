import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { reportItems } from './constants'
import { reportsColumns } from './reports-columns'
import ExportForm from '../tasklist/components/export-form'
import ArrowDown from '@/assets/icons/arrow_down.svg'
import SavedIcon from '@/assets/icons/saved.svg'
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { useGetBranchReportsQuery } from '@/redux/api/reports'
import { BranchReportsPayloadInterface } from '@/types/interface/reports'

export default function ReportsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [exportFormOpen, setExportFormOpen] = useState(false)

    const [branchReportsQuery, setBranchReportsQuery] =
        useState<BranchReportsPayloadInterface>({
            offset: {
                count: 50,
                page: 1,
            },
            filter: {},
            sorts: {},
            period: {
                period_start: '2024-01-01',
                period_end: '2025-01-26',
            },
        })

    const {
        data = { count: 0, data: [] },
        isError,
        isLoading,
        refetch,
    } = useGetBranchReportsQuery(branchReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.branch.branch_id,
        id: row.branch.branch_id,
        name: row.branch.branch_name,
        completedPercent: row.completed_percent,
        completedCount: row.completed_count,
        checkedPercent: row.checked_percent,
        checkedCount: row.checked_count,
    }))

    if (isError) {
        return <CustomAlert />
    }

    return (
        <Fragment>
            <PageLayout
                title={t('reports')}
                onRefreshClick={refetch}
                rightBlock={
                    <div>
                        {/* TODO: добавить контекст для фильтров */}
                        {/* <DateRangeFilter /> */}
                        <div className="flex gap-3">
                            <Button
                                className="bg-white hover:bg-accent rounded-xl"
                                onClick={() => navigate('/reports/saved')}
                            >
                                <SavedIcon />
                                <p className="mx-[8px] text-base font-normal">
                                    {t('saved')}
                                </p>
                                <ArrowDown />
                            </Button>
                            <FormDialog
                                open={exportFormOpen}
                                setOpen={setExportFormOpen}
                                actionButton={
                                    <ExcelButton buttonType="export" />
                                }
                                addItemForm={<ExportForm />}
                            />
                        </div>
                    </div>
                }
            >
                <Breadcrumbs items={reportItems} />
                <DataTable
                    data={formattedReports}
                    columns={reportsColumns}
                    hasBackground
                    getPaginationInfo={(pageSize, pageIndex) => {
                        setBranchReportsQuery({
                            ...branchReportsQuery,
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    onRowClick={(rowData) =>
                        navigate(`checkpoints`, {
                            state: {
                                branch: data.data.find(
                                    (e) => e.branch.branch_id === rowData.id
                                )?.branch,
                            },
                        })
                    }
                    paginationInfo={{
                        itemCount: data.count,
                        pageSize: branchReportsQuery.offset.count,
                    }}
                    isLoading={isLoading}
                />
            </PageLayout>
        </Fragment>
    )
}
