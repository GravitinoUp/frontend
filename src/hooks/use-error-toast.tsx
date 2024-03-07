import { useEffect } from 'react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useTranslation } from 'react-i18next'
import { ToastAction } from '@/components/ui/toast.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { ErrorInterface } from '@/types/interface/fetch'

const ERROR_DURATION = 3000

export const useErrorToast = (
    repeatFn?: () => void,
    error?: FetchBaseQueryError | SerializedError | undefined
) => {
    const { toast } = useToast()
    const { t } = useTranslation()

    useEffect(() => {
        if (error) {
            const errorData = error as {
                status: number
                data: ErrorInterface | undefined
            }

            toast({
                variant: 'destructive',
                title: t('toast.error.title'),
                description: errorData.data ? errorData.data.text : '',
                duration: ERROR_DURATION,
                action:
                    typeof repeatFn === 'undefined' ? (
                        void 0
                    ) : (
                        <ToastAction
                            altText={t('toast.error.try.again')}
                            onClick={repeatFn}
                        >
                            {t('toast.error.try.again')}
                        </ToastAction>
                    ),
            })
        }
    }, [error, toast])
}
