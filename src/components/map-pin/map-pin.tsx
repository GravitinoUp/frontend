import MapCheckpointPopover from '../map-checkpoint-popover/map-checkpoint-popover'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import CarIcon from '@/assets/icons/car_icon.svg'
import TrainIcon from '@/assets/icons/train_icon.svg'
import ShipIcon from '@/assets/icons/ship_icon.svg'
import PeopleIcon from '@/assets/icons/people_icon.svg'
import PlaneIcon from '@/assets/icons/plane_icon.svg'
import MixedIcon from '@/assets/icons/mixed_icon.svg'
import MapPinIcon from '@/assets/icons/map_pin_icon.svg'
import { CHECKPOINT_COMPLETED_STATUSES, CHECKPOINT_TYPES } from '@/constants/constants'
import { CheckpointInterface } from '@/types/interface/checkpoint'

export default function MapPin({
    checkpoint,
}: {
    checkpoint: CheckpointInterface
}) {
    const completedCount = checkpoint.checkpoint_id == 1 ? 7 : checkpoint.checkpoint_id == 4 ? 14 : 25
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
                            ${completedCount < CHECKPOINT_COMPLETED_STATUSES.MIN ? 'bg-map-completed-red' : completedCount < CHECKPOINT_COMPLETED_STATUSES.MEDIUM ? 'bg-map-completed-yellow' : 'bg-map-closed'}
                            rounded-full
                            flex justify-center items-center
                            top-0
                            mx-[4px]
                            mt-[4px]
                        `}
                    >
                        <div className="w-[34px] h-[34px] flex justify-center items-center fill-white">
                            {checkpointTypeId == CHECKPOINT_TYPES.CAR && <CarIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.TRAIN && <TrainIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.SHIP && <ShipIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.PLANE && <PlaneIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.RIVER && <ShipIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.MIXED && <MixedIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.PEOPLE && <PeopleIcon />}
                            {checkpointTypeId == CHECKPOINT_TYPES.LAKE && <ShipIcon />}
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
