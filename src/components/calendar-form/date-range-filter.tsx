import { Dispatch, SetStateAction, useState } from 'react'
import { parseISO } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import CalendarIcon from '@/assets/icons/Calendar.svg'
import ExpandDown from '@/assets/icons/expand_down.svg'
import ExpandUp from '@/assets/icons/expand_up.svg'
import { useGetRangeText } from '@/components/calendar-form/use-get-range-text.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { cn } from '@/lib/utils.ts'

interface DateRangeFilterProps<T> {
    filterQuery: T
    setFilterQuery: Dispatch<SetStateAction<T>>
}

const DateRangeFilter = <
    T extends { period: { date_start?: string; date_end?: string } },
>({
    filterQuery,
    setFilterQuery,
}: DateRangeFilterProps<T>) => {
    const { t } = useTranslation()
    const [collapsed, setCollapsed] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: filterQuery.period.date_start
            ? parseISO(filterQuery.period.date_start)
            : void 0,
        to: filterQuery.period.date_end
            ? parseISO(filterQuery.period.date_end)
            : void 0,
    })
    const { rangeHeader, rangeDescription } = useGetRangeText(dateRange)

    const handleRangePick = () => {
        setFilterQuery({
            ...filterQuery,
            period: {
                ...filterQuery.period,
                date_start: dateRange?.from?.toISOString(),
                date_end: dateRange?.to
                    ? dateRange.to.toISOString()
                    : new Date().toISOString(),
            },
        })
    }

    const handleResetRange = () => {
        setFilterQuery({
            ...filterQuery,
            period: {
                ...filterQuery.period,
                date_start: new Date().toISOString(),
                date_end: new Date().toISOString(),
            },
        })
        setDateRange({
            from: new Date(),
        })
    }

    return (
        <div className="flex flex-col items-center bg-white rounded-xl px-3 py-4 mb-7">
            <div className="flex items-center">
                <div />
                {rangeHeader}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ExpandUp /> : <ExpandDown />}
                </Button>
            </div>
            {collapsed && (
                <>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'w-[240px] pl-3 text-left font-normal rounded-xl gap-2.5 justify-start mt-5',
                                    !dateRange && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon />
                                {rangeDescription}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <div>
                        <Button
                            className="w-[110px] mt-10 mr-5 rounded-2xl text-base font-bold"
                            type="button"
                            onClick={handleRangePick}
                            disabled={!dateRange?.from}
                        >
                            {t('button.action.save')}
                        </Button>
                        <Button
                            className="w-[110px] mt-10 rounded-2xl text-base"
                            type="button"
                            variant="outline"
                            onClick={handleResetRange}
                        >
                            {t('button.action.reset')}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default DateRangeFilter
