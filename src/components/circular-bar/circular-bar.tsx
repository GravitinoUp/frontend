import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import getQualityColor from './get-quality-color'
import { cn } from '@/lib/utils'
import 'react-circular-progressbar/dist/styles.css'

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
