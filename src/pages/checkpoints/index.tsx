import { useState } from 'react'

import { checkpointsColumns } from './checkpoint-columns'
import { checkpointsFormTab } from './checkpoint-form-tab'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import {
    CheckpointsPayloadInterface,
    FormattedCheckpointsInterface,
} from '@/types/interface/checkpoint'

export default function CheckpointsPage() {
    const [formOpen, setFormOpen] = useState(false)

    const personalCheckpointsQuery: CheckpointsPayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
    }

    const {
        data: checkpoints = [],
        isError,
        isLoading,
        refetch,
    } = useGetCheckpointsQuery(personalCheckpointsQuery)
// @ts-ignore
    const formattedCheckpoints: FormattedCheckpointsInterface[] =
        checkpoints.map((row) => ({
            checkpoint: row,
            id: row.checkpoint_id,
            key: row.checkpoint_id,
            checkpoint_name: row.checkpoint_name,
            address: row.address,
            branch_name: row.branch.branch_name,
            working_hours: row.working_hours,
            neighboring_state: row.neighboring_state,
            region: row.region,
            checkpoint_type_name: row.checkpoint_type.checkpoint_type_name,
        }))

    return (
        <PageLayout
            title="Пункты пропуска"
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={
                        <CustomTabs
                            tabs={checkpointsFormTab()}
                            setDialogOpen={setFormOpen}
                        />
                    }
                />
            }
            rightBlock={
                <div>
                    <div className="h-16 " />
                    <div className="flex gap-3 mb-3">
                        <ExcelButton type="export" onClick={() => {}} />
                        <ExcelButton type="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            {isLoading && <LoadingSpinner />}
            {isError && <CustomAlert />}
            <DataTable
                data={formattedCheckpoints}
                columns={checkpointsColumns}
                hasBackground
            />
        </PageLayout>
    )
}
