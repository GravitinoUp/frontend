import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { reportsColumns } from './reports-columns'
import ExportForm from '../tasklist/export-form'
import ArrowDown from '@/assets/icons/arrow_down.svg'
import SavedIcon from '@/assets/icons/saved.svg'
import CalendarForm from '@/components/calendar-form/calendar-form'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
    const { t } = useTranslation()

    const [exportFormOpen, setExportFormOpen] = useState(false)

    return (
        <PageLayout
            title={t('reports')}
            //onRefreshClick={refetch}
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
            <DataTable
                data={[
                    {
                        key: 1,
                        id: 1,
                        name: 'Филиал 1',
                        completedPercent: 100,
                        completedCount: 50,
                        checkedPercent: 100,
                        checkedCount: 50,
                    },
                ]}
                columns={reportsColumns}
                hasBackground
                // getPaginationInfo={(pageSize, pageIndex) => {
                //     setPersonalOrdersQuery({
                //         ...personalOrdersQuery,
                //         offset: { count: pageSize, page: pageIndex + 1 },
                //     })
                // }}
                // onRowClick={(rowData) =>
                //     navigate(`task`, {
                //         state: {
                //             order: data.data.find(
                //                 (e) => e.order_id === rowData.id
                //             ),
                //         },
                //     })
                // }
                paginationInfo={{
                    itemCount: 10,
                    pageSize: 10,
                }}
                //isLoading={isLoading}
            />
        </PageLayout>
    )
}
