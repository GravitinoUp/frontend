import { Dispatch, SetStateAction, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast.ts'

const SUCCESS_DURATION = 1500

export const useSuccessToast = (successMsg: string, isSuccess: boolean,
    setDialogOpen?: Dispatch<SetStateAction<boolean>>) => {
    const { toast } = useToast()

    useEffect(() => {
        if (isSuccess) {
            toast({
                description: successMsg,
                duration: SUCCESS_DURATION,
            })
            setDialogOpen?.(false)
        }
    }, [isSuccess, toast])
}