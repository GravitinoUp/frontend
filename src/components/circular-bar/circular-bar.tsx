import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { QUALITY_STATUSES } from '@/constants/constants'
import { cn } from '@/lib/utils'
import 'react-circular-progressbar/dist/styles.css'

function getQualityColor(percent: number, light: boolean) {
    if (percent >= QUALITY_STATUSES.HIGH) {
        return light ? '#DBF2E2' : '#49C96D'
    } else if (percent >= QUALITY_STATUSES.MEDIUM) {
        return light ? '#FFF4D0' : '#FFD240'
    } else {
        return light ? '#FFEAEA' : '#FF6B6B'
    }
}

interface CircularBarProps {
    value: number
}

const CircularBar = ({ value }: CircularBarProps) => {
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        setPercent(value)
    }, [value])

    return (
        <div className="w-10 h-10">
            <CircularProgressbarWithChildren
                styles={{
                    trail: { stroke: getQualityColor(percent, true) },
                    path: { stroke: getQualityColor(percent, false) },
                }}
                value={percent}
            >
                <p
                    className={cn(
                        'text-[14px]',
                        `text-[${getQualityColor(percent, false)}]`
                    )}
                >
                    {percent}
                </p>
            </CircularProgressbarWithChildren>
        </div>
    )
}

export default CircularBar
