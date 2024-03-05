import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { placeholderQuery } from '../tasklist/constants.ts'
import FilterIcon from '@/assets/icons/filter_icon.svg'
import MinimizeIcon from '@/assets/icons/minimize_icon.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import RoundedButton from '@/components/rounded-button/rounded-button'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import { CheckpointsPayloadInterface } from '@/types/interface/checkpoint'
import YandexMap from '@/components/map/yandex-map'

export default function MapPage() {
    const { t } = useTranslation()

    const [checkpointsQuery] =
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
                    <RoundedButton icon={<FilterIcon />} onClick={() => {
                    }} />
                    <RoundedButton icon={<MinimizeIcon />} onClick={() => {
                    }} />
                </div>
            </div>
            {isLoading && <LoadingSpinner />}
            {isError && <CustomAlert />}

            <YandexMap checkpoints={checkpoints} enableRounded={false} />
        </div>
    )
}
