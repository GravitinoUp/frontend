import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { checkpointsColumns } from './checkpoint-columns'
import { checkpointsFormTab } from './checkpoint-form-tab'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import {
    CheckpointsPayloadInterface,
    FormattedCheckpointsInterface,
} from '@/types/interface/checkpoint'

export default function CheckpointsPage() {
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    const [checkpointsQuery, setCheckpointsQuery] =
        useState<CheckpointsPayloadInterface>({
            ...placeholderQuery,
            sorts: { checkpoint_id: 'ASC' },
        })

    const {
        data: checkpoints = { count: 0, data: [] },
        isError,
        isLoading,
        refetch,
    } = useGetCheckpointsQuery(checkpointsQuery)

    const formattedCheckpoints: FormattedCheckpointsInterface[] =
        checkpoints.data.map((row) => ({
            checkpoint: row,
            checkpoint_id: row.checkpoint_id,
            key: row.checkpoint_id,
            checkpoint_name: row.checkpoint_name,
            address: row.address,
            branch_name: row.branch.branch_name,
            working_hours_name: row.working_hours?.working_hours_name,
            neighboring_state_name:
                row.neighboring_state?.neighboring_state_name,
            operating_mode_name: row.operating_mode?.operating_mode_name,
            region: row.region,
            checkpoint_type_name: row.checkpoint_type.checkpoint_type_name,
        }))

    return (
        <PageLayout
            title={t('checkpoints')}
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
                        <ExcelButton buttonType="export" onClick={() => {}} />
                        <ExcelButton buttonType="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            {isError ? (
                <CustomAlert />
            ) : (
                <DataTable
                    data={formattedCheckpoints}
                    columns={checkpointsColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting) => {
                        let sorts = {}
                        sorting.forEach((value) => {
                            const desc = value.desc ? 'DESC' : 'ASC'

                            switch (value.id) {
                                case 'branch_name':
                                    sorts = {
                                        ...sorts,
                                        branch: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                case 'working_hours_name':
                                    sorts = {
                                        ...sorts,
                                        working_hours: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                case 'operating_mode_name':
                                    sorts = {
                                        ...sorts,
                                        operating_mode: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                case 'neighboring_state_name':
                                    sorts = {
                                        ...sorts,
                                        neighboring_state: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                case 'checkpoint_type_name':
                                    sorts = {
                                        ...sorts,
                                        checkpoint_type: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                default:
                                    sorts = {
                                        ...sorts,
                                        [`${value.id}`]: desc,
                                    }
                                    break
                            }
                        })

                        setCheckpointsQuery({
                            ...checkpointsQuery,
                            sorts,
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    paginationInfo={{
                        itemCount: checkpoints.count,
                        pageSize: checkpointsQuery.offset.count,
                    }}
                    isLoading={isLoading}
                />
            )}
        </PageLayout>
    )
}
