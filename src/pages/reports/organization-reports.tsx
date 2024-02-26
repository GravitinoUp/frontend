import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { reportItems } from '.'
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
import { useGetOrganizationReportsQuery } from '@/redux/api/reports'
import { CheckpointInterface } from '@/types/interface/checkpoint'
import { OrganizationReportsPayloadInterface } from '@/types/interface/reports'

export default function OrganizationReportsPage() {
    const { t } = useTranslation()
    const { state } = useLocation()
    const checkpoint: CheckpointInterface = state.checkpoint

    const [exportFormOpen, setExportFormOpen] = useState(false)

    const [organizationReportsQuery, setOrganizationReportsQuery] =
        useState<OrganizationReportsPayloadInterface>({
            checkpoint_id: checkpoint.checkpoint_id,
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
    } = useGetOrganizationReportsQuery(organizationReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.organization.organization_id,
        id: row.organization.organization_id,
        name: row.organization.short_name,
        completedPercent: row.completed_percent,
        completedCount: row.completed_count,
        checkedPercent: row.checked_percent,
        checkedCount: row.checked_count,
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
                    <CalendarForm open={false} />
                    <div className="flex gap-3">
                        <Button
                            className="bg-white hover:bg-accent rounded-xl"
                            onClick={() => {}}
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
                            actionButton={<ExcelButton buttonType="export" />}
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
                    setOrganizationReportsQuery({
                        ...organizationReportsQuery,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                paginationInfo={{
                    itemCount: data.count,
                    pageSize: organizationReportsQuery.offset.count,
                }}
                isLoading={isLoading}
            />
        </PageLayout>
    )
}
