import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastAction } from '@/components/ui/toast.tsx'
import { useToast } from '@/components/ui/use-toast.ts'

const ERROR_DURATION = 3000

export const useErrorToast = (isError: boolean, repeatFn?: () => void) => {
    const { toast } = useToast()
    const { t } = useTranslation()

    useEffect(() => {
        if (isError) {
            toast({
                variant: 'destructive',
                title: t('toast.error.title'),
                description: t('toast.error.description'),
                duration: ERROR_DURATION,
                action: typeof repeatFn === 'undefined' ? undefined : (
                    <ToastAction
                        altText={t('toast.error.try.again')}
                        onClick={repeatFn}
                    >
                        {t('toast.error.try.again')}
                    </ToastAction>
                ),
            })
        }
    }, [isError, toast])
}