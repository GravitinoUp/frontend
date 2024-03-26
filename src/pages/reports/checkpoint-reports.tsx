import { Fragment, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { reportItems } from './constants'
import ReportFiltersForm from './report-filters-form'
import { reportsColumns, reportsColumnsVisibility } from './reports-columns'
import ExportForm from '../../components/form/export-form'
import ArrowDown from '@/assets/icons/arrow_down.svg'
import SavedIcon from '@/assets/icons/saved.svg'
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import DateRangeFilter from '@/components/calendar-form/date-range-filter'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import ExcelButton from '@/components/excel-button/excel-button'
import { PageLayout } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { ReportsFilterQueryContext } from '@/context/tasks/reports-filter-query'
import { useGetCheckpointReportsQuery } from '@/redux/api/reports'
import { REPORTS_SAVED } from '@/routes.ts'
import { BranchInterface } from '@/types/interface/branch'

export default function CheckpointReportsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { state } = useLocation()
    const branch: BranchInterface = state.branch

    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [filterFormOpen, setFilterFormOpen] = useState(false)

    const {
        reportsQuery: checkpointReportsQuery,
        setReportsQuery: setCheckpointReportsQuery,
    } = useContext(ReportsFilterQueryContext)

    const {
        data = { count: 0, data: [] },
        isError,
        isFetching,
        refetch,
    } = useGetCheckpointReportsQuery({
        ...checkpointReportsQuery,
        branch_id: branch.branch_id,
    })

    const formattedReports = data.data.map((row) => ({
        key: row.checkpoint.checkpoint_id,
        id: row.checkpoint.checkpoint_id,
        name: row.checkpoint.checkpoint_name,
        completed_percent: row.completed_percent,
        completed_count: row.completed_count,
        checked_percent: row.checked_percent,
        checked_count: row.checked_count,
        neighboring_state:
            row.checkpoint.neighboring_state.neighboring_state_name,
    }))

    if (isError) {
        return <CustomAlert />
    }

    return (
        <Fragment>
            <DialogWindow
                open={filterFormOpen}
                setOpen={setFilterFormOpen}
                trigger={null}
                size="md"
                header={
                    <h2 className="text-3xl font-semibold text-black">
                        {t('choose.filters')}
                    </h2>
                }
                content={
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
                        <DateRangeFilter
                            filterQuery={checkpointReportsQuery}
                            setFilterQuery={setCheckpointReportsQuery}
                        />
                        <div className="flex gap-3">
                            <Button
                                className="bg-white hover:bg-accent rounded-xl"
                                onClick={() => navigate(REPORTS_SAVED)}
                            >
                                <SavedIcon />
                                <p className="mx-[8px] text-base font-normal">
                                    {t('saved')}
                                </p>
                                <ArrowDown />
                            </Button>
                            <DialogWindow
                                open={exportFormOpen}
                                setOpen={setExportFormOpen}
                                trigger={<ExcelButton buttonType="export" />}
                                content={<ExportForm />}
                            />
                        </div>
                    </div>
                }
            >
                <Breadcrumbs items={reportItems} />
                <DataTable
                    data={formattedReports}
                    columns={reportsColumns}
                    columnVisibility={{
                        ...reportsColumnsVisibility,
                        neighboring_state: true,
                    }}
                    hasBackground
                    searchSuffixIconClick={() => setFilterFormOpen(true)}
                    getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                        const sorts = sorting.reduce((acc, value) => {
                            const currentSortOrder = value.desc ? 'DESC' : 'ASC'

                            switch (value.id) {
                                case 'id':
                                    return {
                                        ...acc,
                                        checkpoint: {
                                            checkpoint_id: currentSortOrder,
                                        },
                                    }
                                case 'name':
                                    return {
                                        ...acc,
                                        checkpoint: {
                                            checkpoint_name: currentSortOrder,
                                        },
                                    }
                                default:
                                    return {
                                        ...acc,
                                        report: {
                                            [`${value.id}`]: currentSortOrder,
                                        },
                                    }
                            }
                        }, {})

                        setCheckpointReportsQuery({
                            ...checkpointReportsQuery,
                            sorts,
                            filter: {
                                ...checkpointReportsQuery.filter,
                                checkpoint: filter
                                    ? { checkpoint_name: filter }
                                    : undefined,
                            },
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
                        pageIndex: checkpointReportsQuery.offset.page - 1,
                    }}
                    isLoading={isFetching}
                />
            </PageLayout>
        </Fragment>
    )
}
