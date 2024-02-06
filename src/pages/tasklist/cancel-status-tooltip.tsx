import { ChevronRightCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import InfoIcon from '@/assets/icons/Info.svg'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

const CancelStatusTooltip = () => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button className="p-2" variant="ghost">
                    <InfoIcon />
                </Button>
            </TooltipTrigger>
            <TooltipContent className="w-[280px] h-[70px] rounded-xl flex items-center justify-center px-0 py-0 gap-3">
                Необходимо доработать задачу...
                <Link
                    to="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="hover:opacity-70"
                >
                    <ChevronRightCircle />
                </Link>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)

export default CancelStatusTooltip
