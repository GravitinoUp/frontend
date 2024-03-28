import { useState } from 'react'
import CustomTabs from '../custom-tabs/custom-tabs'
import MapCheckpointPopover from '../map-checkpoint-popover/map-checkpoint-popover'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import CarIcon from '@/assets/icons/car_icon.svg'
import LakeIcon from '@/assets/icons/lake_icon.svg'
import MapPinIcon from '@/assets/icons/map_pin_icon.svg'
import MixedIcon from '@/assets/icons/mixed_icon.svg'
import PeopleIcon from '@/assets/icons/people_icon.svg'
import PlaneIcon from '@/assets/icons/plane_icon.svg'
import RiverIcon from '@/assets/icons/river_icon.svg'
import ShipIcon from '@/assets/icons/ship_icon.svg'
import TrainIcon from '@/assets/icons/train_icon.svg'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import {
    CHECKPOINT_COMPLETED_STATUSES,
    CHECKPOINT_TYPES,
} from '@/constants/constants'
import { cn } from '@/lib/utils.ts'
import { checkpointsFormTab } from '@/pages/checkpoints/checkpoint-form-tab'
import { CheckpointInterface } from '@/types/interface/checkpoint'

export default function MapPin({
    checkpoint,
}: {
    checkpoint: CheckpointInterface
}) {
    const completedPercent = checkpoint.report?.completed_percent ?? -1

    const [formOpen, setFormOpen] = useState(false)

    return (
        <div
            className="
                translate-x-[-50%] translate-y-[-100%]
                flex justify-center items-center
                drop-shadow-md
            "
        >
            <DialogWindow
                open={formOpen}
                setOpen={setFormOpen}
                trigger={null}
                content={
                    <CustomTabs
                        tabs={checkpointsFormTab(checkpoint)}
                        setDialogOpen={setFormOpen}
                    />
                }
            />
            <Popover>
                <PopoverTrigger>
                    <div
                        className={cn(
                            completedPercent >=
                                CHECKPOINT_COMPLETED_STATUSES.MAX
                                ? 'bg-map-closed'
                                : completedPercent >=
                                    CHECKPOINT_COMPLETED_STATUSES.MEDIUM
                                  ? 'bg-map-completed-yellow'
                                  : 'bg-map-completed-red',
                            'absolute rounded-full flex justify-center items-center top-0 mx-1 mt-1'
                        )}
                    >
                        <div className="w-[34px] h-[34px] flex justify-center items-center fill-white">
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.CAR && <CarIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.TRAIN && <TrainIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.SHIP && <ShipIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.PLANE && <PlaneIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.RIVER && <RiverIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.MIXED && <MixedIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.PEOPLE && <PeopleIcon />}
                            {checkpoint.checkpoint_type.checkpoint_type_id ==
                                CHECKPOINT_TYPES.LAKE && <LakeIcon />}
                        </div>
                    </div>

                    <MapPinIcon />
                </PopoverTrigger>
                <PopoverContent className="w-[500px] bg-white rounded-xl p-0 border-0">
                    <MapCheckpointPopover
                        checkpoint={checkpoint}
                        onEditClick={() => {
                            setFormOpen(true)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
