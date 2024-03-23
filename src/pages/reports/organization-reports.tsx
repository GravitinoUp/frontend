import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { reportItems } from './constants'
import { reportsColumns } from './reports-columns'
import ExportForm from '../../components/form/export-form'
import { placeholderQuery } from '../tasklist/constants'
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
import { useGetOrganizationReportsQuery } from '@/redux/api/reports'
import { REPORTS_SAVED } from '@/routes.ts'
import { CheckpointInterface } from '@/types/interface/checkpoint'
import { OrganizationReportsPayloadInterface } from '@/types/interface/reports'

export default function OrganizationReportsPage() {
    const { t } = useTranslation()
    const { state } = useLocation()
    const navigate = useNavigate()
    const checkpoint: CheckpointInterface = state.checkpoint

    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [organizationReportsQuery, setOrganizationReportsQuery] =
        useState<OrganizationReportsPayloadInterface>({
            checkpoint_id: checkpoint.checkpoint_id,
            ...placeholderQuery,
        })

    const {
        data = { count: 0, data: [] },
        isError,
        isLoading,
        refetch,
    } = useGetOrganizationReportsQuery(organizationReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.organization.organization_id,
        id: row.organization.organization_id,
        name: row.organization.short_name,
        completed_percent: row.completed_percent,
        completed_count: row.completed_count,
        checked_percent: row.checked_percent,
        checked_count: row.checked_count,
    }))

    if (isError) {
        return <CustomAlert />
    }

    return (
        <PageLayout
            title={t('reports')}
            onRefreshClick={refetch}
            rightBlock={
                <div>
                    <DateRangeFilter
                        filterQuery={organizationReportsQuery}
                        setFilterQuery={setOrganizationReportsQuery}
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
                hasBackground
                getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                    const sorts = sorting.reduce((acc, value) => {
                        const currentSortOrder = value.desc ? 'DESC' : 'ASC'

                        switch (value.id) {
                            case 'id':
                                return {
                                    ...acc,
                                    organization: {
                                        organization_id: currentSortOrder,
                                    },
                                }
                            case 'name':
                                return {
                                    ...acc,
                                    organization: {
                                        short_name: currentSortOrder,
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

                    setOrganizationReportsQuery({
                        ...organizationReportsQuery,
                        sorts,
                        filter: {
                            ...organizationReportsQuery.filter,
                            organization: { full_name: filter },
                        },
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                paginationInfo={{
                    itemCount: data.count,
                    pageSize: organizationReportsQuery.offset.count,
                    pageIndex: organizationReportsQuery.offset.page - 1,
                }}
                isLoading={isLoading}
            />
        </PageLayout>
    )
}
