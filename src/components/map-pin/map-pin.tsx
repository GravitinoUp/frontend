import { PlaneIcon, ShipIcon, TrainFrontIcon } from 'lucide-react'
import MapCheckpointPopover from '../map-checkpoint-popover/map-checkpoint-popover'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import CarIcon from '@/assets/icons/car_icon.svg'
import MapPinIcon from '@/assets/icons/map_pin_icon.svg'
import { CheckpointInterface } from '@/types/interface/checkpoint'

export default function MapPin({
    checkpoint,
}: {
    checkpoint: CheckpointInterface
}) {
    const completedCount = checkpoint.checkpoint_id == 1 ? 10 : checkpoint.checkpoint_id == 4 ? 19 : 25
    const checkpointTypeId = checkpoint.checkpoint_type.checkpoint_type_id
    return (
        <div
            className="
                translate-x-[-50%] translate-y-[-100%]
                flex justify-center items-center
                drop-shadow-md
            "
        >
            <Popover>
                <PopoverTrigger>
                    <div
                        className={`
                            absolute
                            ${completedCount < 15 ? 'bg-map-completed-red' : completedCount < 20 ? 'bg-map-completed-yellow' : 'bg-map-closed'}
                            rounded-full
                            flex justify-center items-center
                            top-0
                            m-1
                        `}
                    >
                        <div className="p-2">
                            {checkpointTypeId == 1 && <CarIcon />}
                            {checkpointTypeId == 2 && <TrainFrontIcon size={20} color='white' />}
                            {checkpointTypeId == 3 && <ShipIcon size={20} color='white' />}
                            {checkpointTypeId == 4 && <PlaneIcon size={20} color='white' />}
                        </div>
                    </div>

                    <MapPinIcon />
                </PopoverTrigger>
                <PopoverContent className="w-[500px] bg-white rounded-xl p-0 border-0">
                    <MapCheckpointPopover
                        checkpoint={checkpoint}
                        onEditClick={() => { }}
                    />
                </PopoverContent>
            </Popover>
        </div >
    )
}
