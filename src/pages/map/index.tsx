import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { placeholderQuery } from '../tasklist/constants.ts'
import FilterIcon from '@/assets/icons/filter_icon.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import YandexMap from '@/components/map/yandex-map'
import RoundedButton from '@/components/rounded-button/rounded-button'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import { CheckpointsPayloadInterface } from '@/types/interface/checkpoint'
import FormDialog from '@/components/form-dialog/form-dialog.tsx'
import MapFiltersForm from './map-filters-form.tsx'

export default function MapPage() {
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    const [checkpointsQuery, setCheckpointQuery] =
        useState<CheckpointsPayloadInterface>({
            ...placeholderQuery,
            sorts: { checkpoint_id: 'ASC' },
        })

    const {
        data: checkpoints = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetCheckpointsQuery(checkpointsQuery)

    return (
        <div className="w-full h-full flex flex-col border-2">
            <div className="border-b-2 bg-white flex justify-between items-center px-6">
                <h2 className="text-2xl font-medium py-6">{t('map.title')}</h2>
                <div className="flex flex-row gap-4">
                    <FormDialog
                        open={formOpen}
                        setOpen={setFormOpen}
                        actionButton={<RoundedButton icon={<FilterIcon />} onClick={() => { }} />}
                        addItemForm={
                            <MapFiltersForm handleSubmit={(data) => {
                                setCheckpointQuery({
                                    ...checkpointsQuery,
                                    filter: {
                                        checkpoint_type: data.checkpoint_types,
                                    },
                                    report_filter: {
                                        min_completed_percent: Number(data.minPercent),
                                        max_completed_percent: Number(data.maxPercent),
                                    }
                                })

                                setFormOpen(false)
                            }}
                                data={{
                                    checkpoint_types: checkpointsQuery.filter?.checkpoint_type ?? [],
                                    minPercent: checkpointsQuery.report_filter?.min_completed_percent?.toString() ?? '0',
                                    maxPercent: checkpointsQuery.report_filter?.max_completed_percent?.toString() ?? '100',
                                }}
                                setDialogOpen={(value) => {
                                    setFormOpen(value)

                                    setCheckpointQuery({
                                        ...checkpointsQuery,
                                        filter: {},
                                        report_filter: {}
                                    })
                                }} />
                        }
                    />
                </div>
            </div>
            {isLoading && <LoadingSpinner />}
            {isError && <CustomAlert />}

            <YandexMap checkpoints={checkpoints} enableRounded={false} />
        </div>
    )
}
