import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

export const QrPageSkeleton = () => {
    const { t } = useTranslation()

    return (
        <div className="flex items-end w-[840px]">
            <div className="w-[540px]">
                <Label className="inline-block mb-2">{t('checkpoint')}</Label>
                <Skeleton className="h-[40px] w-[540px] rounded-xl" />
            </div>
            <Button
                className="w-[120px] h-[40px] ml-8 rounded-2xl font-[700]"
                disabled
            >
                {t('button.action.create')}
            </Button>
        </div>
    )
}
