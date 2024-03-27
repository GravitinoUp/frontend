import { Fragment, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { reportItems } from './constants'
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
import { useGetBranchReportsQuery } from '@/redux/api/reports'
import { REPORTS_SAVED } from '@/routes.ts'

export default function ReportsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [exportFormOpen, setExportFormOpen] = useState(false)

    const {
        reportsQuery: branchReportsQuery,
        setReportsQuery: setBranchReportsQuery,
    } = useContext(ReportsFilterQueryContext)

    const {
        data = { count: 0, data: [] },
        isError,
        isFetching,
        refetch,
    } = useGetBranchReportsQuery(branchReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.branch.branch_id,
        id: row.branch.branch_id,
        name: row.branch.branch_name,
        completed_percent: row.completed_percent,
        completed_count: row.completed_count,
        checked_percent: row.checked_percent,
        checked_count: row.checked_count,
    }))

    if (isError) {
        return <CustomAlert />
    }

    return (
        <Fragment>
            <PageLayout
                title={t('reports')}
                onRefreshClick={refetch}
                isLoading={isFetching}
                rightBlock={
                    <div>
                        <DateRangeFilter
                            filterQuery={branchReportsQuery}
                            setFilterQuery={setBranchReportsQuery}
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
                    columnVisibility={reportsColumnsVisibility}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                        const sorts = sorting.reduce((acc, value) => {
                            const currentSortOrder = value.desc ? 'DESC' : 'ASC'

                            switch (value.id) {
                                case 'id':
                                    return {
                                        ...acc,
                                        branch: {
                                            branch_id: currentSortOrder,
                                        },
                                    }
                                case 'name':
                                    return {
                                        ...acc,
                                        branch: {
                                            branch_name: currentSortOrder,
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

                        setBranchReportsQuery({
                            ...branchReportsQuery,
                            sorts,
                            filter: {
                                ...branchReportsQuery.filter,
                                branch: filter
                                    ? { branch_name: filter }
                                    : undefined,
                            },
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
                        pageIndex: branchReportsQuery.offset.page - 1,
                    }}
                    isLoading={isFetching}
                />
            </PageLayout>
        </Fragment>
    )
}
