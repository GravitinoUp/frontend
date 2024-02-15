import { Fragment } from 'react'
import MapPinIcon from '@/assets/icons/map_pin_icon.svg'

export default function MapPin({
    icon,
    onClick,
}: {
    icon: JSX.Element
    onClick: () => void
}) {
    return (
        <div
            className="
                translate-x-[-50%] translate-y-[-100%]
                flex justify-center items-center
                drop-shadow-md
            "
            onClick={onClick}
        >
            <div
                className="
                    absolute
                    bg-[#3478F5]
                    rounded-full
                    flex justify-center items-center
                    top-0
                    m-1
                "
            >
                <div className="p-2">{icon}</div>
            </div>

            <MapPinIcon />
        </div>
    )
}
