import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

interface RefreshButtonProps {
    isLoading?: boolean
    onClick: () => void
}

const RefreshButton = ({ onClick, isLoading }: RefreshButtonProps) => {
    const [isSpinning, setIsSpinning] = useState(false)

    const handleClick = () => {
        setIsSpinning(true)
        onClick()
    }

    useEffect(() => {
        if (!isLoading) {
            setIsSpinning(false)
        }
    }, [isLoading])

    return (
        <Button
            variant="outline"
            size="icon"
            className="bg-white border-solid border-[2px] rounded-3xl flex items-center justify-center p-[7px] size-8"
            onClick={handleClick}
        >
            <div className={`${isSpinning && isLoading ? 'animate-spin' : ''}`}>
                <RefreshCw color="black" size={17} />
            </div>
        </Button>
    )
}

export default RefreshButton
