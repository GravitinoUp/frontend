import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/utils/helpers.ts'

export const useGetRangeText = (dateRange?: DateRange) => {
    const { t } = useTranslation()
    let rangeHeader
    let rangeDescription

    if (dateRange?.from) {
        if (!dateRange.to) {
            rangeHeader = (
                <p className="font-bold text-2xl text-[#3F434A]">
                    {formatDate(dateRange.from)}–{formatDate(dateRange.from)}
                </p>
            )
            rangeDescription = (
                <p className="text-sm text-[#3F434A]">
                    {formatDate(dateRange.from)}–{formatDate(dateRange.from)}
                </p>
            )
        } else if (dateRange.to) {
            rangeHeader = (
                <p className="font-bold text-2xl text-[#3F434A]">
                    {formatDate(dateRange.from)}–{formatDate(dateRange.to)}
                </p>
            )
            rangeDescription = (
                <p className="text-sm text-[#3F434A]">
                    {formatDate(dateRange.from)}–{formatDate(dateRange.to)}
                </p>
            )
        }
    } else {
        rangeHeader = (
            <p className="font-bold text-2xl text-[#3F434A]">
                {t('date.picker.range.description')}
            </p>
        )
        rangeDescription = (
            <p className="text-sm text-[#3F434A]">
                {t('date.picker.range.description')}
            </p>
        )
    }

    return { rangeHeader, rangeDescription }
}
