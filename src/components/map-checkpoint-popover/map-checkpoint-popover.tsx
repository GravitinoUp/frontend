import { PopoverClose } from '@radix-ui/react-popover'
import { ClockIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CountField from './count-field'
import CloseIcon from '@/assets/icons/close_rounded.svg'
import EditIcon from '@/assets/icons/edit_icon.svg'
import { CheckpointInterface } from '@/types/interface/checkpoint'

export default function MapCheckpointPopover({
    checkpoint,
    onEditClick,
}: {
    checkpoint: CheckpointInterface
    onEditClick: () => void
}) {
    const { t } = useTranslation()

    return (
        <div>
            <div className="p-5">
                <div className="flex flex-row justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold">
                        {checkpoint.checkpoint_name}
                    </h2>
                    <div className="flex flex-row items-center h-[30px]">
                        <button className="mr-2" onClick={onEditClick}>
                            <EditIcon />
                        </button>
                        <PopoverClose>
                            <CloseIcon />
                        </PopoverClose>
                    </div>
                </div>

                <div className="flex flex-row items-center">
                    <ClockIcon className="mr-5" size={20} />
                    <p className="text-sm">
                        {t('working.hours')} •{' '}
                        {checkpoint.working_hours?.working_hours_name}
                    </p>
                </div>
            </div>
            <div className="h-[1px] w-full bg-[#EDEDED]" />
            <div className="p-5 flex flex-row items-center">
                <CountField title={t('completed.task.count')} value={checkpoint.report?.completed_percent ?? 0} />
                <CountField
                    title={t('checked.task.count')}
                    value={checkpoint.report?.checked_percent ?? 0}
                />
            </div>
        </div>
    )
}
