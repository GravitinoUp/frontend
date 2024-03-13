import { ChevronRightCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import InfoIcon from '@/assets/icons/Info.svg'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'

const CancelStatusTooltip = () => {
    const { t } = useTranslation()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className="p-2" variant="ghost">
                        <InfoIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent
                    className="w-[280px] h-[70px] rounded-xl flex items-center justify-center px-0 py-0 gap-3">
                    {t('task.need.work.tooltip')}
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
}

export default CancelStatusTooltip
