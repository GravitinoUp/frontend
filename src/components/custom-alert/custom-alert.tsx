import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CustomAlertProps {
    message?: string
    type?: 'error' | 'warning' | 'success' | 'regular' | 'select'
    className?: string
    onAcceptClick?: () => void
    onCancelClick?: () => void
}

export function CustomAlert({
    message,
    type = 'error',
    onAcceptClick,
    onCancelClick,
    className,
}: CustomAlertProps) {
    const isTypeSelect = type === 'select'
    const { t } = useTranslation()

    return (
        <Alert
            variant={type}
            className={cn(
                isTypeSelect ? 'h-[121px] w-[380px]' : 'h-[60px] w-full',
                className
            )}
        >
            <div className="flex items-center gap-6 ">
                <AlertCircle
                    className={`h-6 w-6 self-start ${
                        isTypeSelect ? 'text-destructive' : ''
                    }`}
                />
                <div
                    className={
                        isTypeSelect ? 'grid grid-rows-2' : 'grid grid-rows-1'
                    }
                >
                    <AlertDescription>
                        {message || t('default.error.message')}
                    </AlertDescription>
                    {isTypeSelect && (
                        <div className="flex justify-center gap-7">
                            <Button
                                className="h-[40px] rounded-xl w-[120px]"
                                onClick={onCancelClick}
                            >
                                {t('no')}
                            </Button>
                            <Button
                                className="h-[40px] rounded-xl w-[120px] bg-background border-[1px] border-[#E8E9EB] border-solid hover:bg-transparent text-destructive"
                                onClick={onAcceptClick}
                            >
                                {t('yes')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Alert>
    )
}
