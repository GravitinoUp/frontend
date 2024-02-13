import { useTranslation } from 'react-i18next'

export default function ReportsPage() {
    const { t } = useTranslation()

    return (
        <div className="grid grid-rows-10 p-7 gap-4 w-full">
            <div className="flex items-center justify-start font-[700] font-pop text-[28px] gap-3 text-[#3F434A]">
                <p>{t('reports')}</p>
            </div>
        </div>
    )
}
