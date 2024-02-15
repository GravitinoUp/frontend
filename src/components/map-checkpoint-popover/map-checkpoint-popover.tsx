import { CheckpointInterface } from '@/types/interface/checkpoint'
import { ClockIcon, Edit2Icon } from 'lucide-react'
import CloseIcon from '@/assets/icons/close_rounded.svg'
import EditIcon from '@/assets/icons/edit_icon.svg'
import { PopoverClose } from '@radix-ui/react-popover'
import CountField from './count-field'

export default function MapCheckpointPopover({
    checkpoint,
    onEditClick,
}: {
    checkpoint: CheckpointInterface
    onEditClick: () => void
}) {
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
                        Время работы •{' '}
                        {checkpoint.working_hours?.working_hours_name}
                    </p>
                </div>
            </div>
            <div className="h-[1px] w-full bg-[#EDEDED]" />
            <div className="p-5 flex flex-row items-center">
                <CountField title="Активных задач" count={20} colorClassName="bg-primary" />
                <CountField
                    title="Закрытых задач"
                    count={20}
                    colorClassName="bg-map-closed"
                />
            </div>
        </div>
    )
}
