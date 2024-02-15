import MapPinIcon from '@/assets/icons/map_pin_icon.svg'
import MapCheckpointPopover from '../map-checkpoint-popover/map-checkpoint-popover'
import { CheckpointInterface } from '@/types/interface/checkpoint'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export default function MapPin({
    icon,
    checkpoint,
}: {
    icon: JSX.Element
    checkpoint: CheckpointInterface
}) {
    const completedCount = checkpoint.checkpoint_id == 1 ? 10 : checkpoint.checkpoint_id == 4 ? 19 : 25
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
                        <div className="p-2">{icon}</div>
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
