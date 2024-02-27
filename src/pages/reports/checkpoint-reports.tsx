import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { reportItems } from './constants'
import ReportFiltersForm from './report-filters-form'
import { reportsColumns } from './reports-columns'
import ExportForm from '../tasklist/export-form'
import ArrowDown from '@/assets/icons/arrow_down.svg'
import SavedIcon from '@/assets/icons/saved.svg'
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import CalendarForm from '@/components/calendar-form/calendar-form'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { useGetCheckpointReportsQuery } from '@/redux/api/reports'
import { BranchInterface } from '@/types/interface/branch'
import { CheckpointReportsPayloadInterface } from '@/types/interface/reports'

export default function CheckpointReportsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { state } = useLocation()
    const branch: BranchInterface = state.branch

    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [filterFormOpen, setFilterFormOpen] = useState(false)

    const [checkpointReportsQuery, setCheckpointReportsQuery] =
        useState<CheckpointReportsPayloadInterface>({
            branch_id: branch.branch_id,
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
    } = useGetCheckpointReportsQuery(checkpointReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.checkpoint.checkpoint_id,
        id: row.checkpoint.checkpoint_id,
        name: row.checkpoint.checkpoint_name,
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
            <FormDialog
                open={filterFormOpen}
                setOpen={setFilterFormOpen}
                actionButton={<Fragment />}
                size="md"
                headerContent={
                    <h2 className="text-3xl font-semibold text-black">
                        {t('choose.filters')}
                    </h2>
                }
                addItemForm={
                    <ReportFiltersForm
                        handleSubmit={(data) => {
                            setCheckpointReportsQuery({
                                ...checkpointReportsQuery,
                                filter: {
                                    checkpoint: {
                                        neighboring_state: {
                                            neighboring_state_id:
                                                data.neighboring_state_id !== 0
                                                    ? data.neighboring_state_id
                                                    : undefined,
                                        },
                                    },
                                },
                            })

                            setFilterFormOpen(false)
                        }}
                        data={{
                            neighboring_state_id:
                                checkpointReportsQuery.filter.checkpoint
                                    ?.neighboring_state?.neighboring_state_id,
                            facility_id: -1,
                        }}
                    />
                }
            />
            <PageLayout
                title={t('reports')}
                onRefreshClick={refetch}
                rightBlock={
                    <div>
                        <CalendarForm open={false} />
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
                    searchSuffixIconClick={() => setFilterFormOpen(true)}
                    getPaginationInfo={(pageSize, pageIndex) => {
                        setCheckpointReportsQuery({
                            ...checkpointReportsQuery,
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    onRowClick={(rowData) =>
                        navigate(`organizations`, {
                            state: {
                                ...state,
                                checkpoint: data.data.find(
                                    (e) =>
                                        e.checkpoint.checkpoint_id ===
                                        rowData.id
                                )?.checkpoint,
                            },
                        })
                    }
                    paginationInfo={{
                        itemCount: data.count,
                        pageSize: checkpointReportsQuery.offset.count,
                    }}
                    isLoading={isLoading}
                />
            </PageLayout>
        </Fragment>
    )
}
