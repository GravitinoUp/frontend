import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton.tsx'

export const UserDataSkeleton = () => {
    const { t } = useTranslation()

    return (
        <>
            <div>
                <label className="text-sm text-[#8A9099] font-normal">
                    {t('full.name')}
                </label>
                <Skeleton className="h-10 w-full rounded-xl mt-3" />
            </div>
            <div className="mt-3">
                <label className="text-sm text-[#8A9099] font-normal">
                    {t('phone')}
                </label>
                <Skeleton className="h-10 w-full rounded-xl mt-3" />
            </div>
            <div className="mt-3">
                <Skeleton className="h-4 w-[66px] rounded-xl mt-3" />
                <Skeleton className="h-10 w-full rounded-xl mt-3" />
            </div>
        </>
    )
}
