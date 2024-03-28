import { cn } from '@/lib/utils.ts'

export default function DashboardTabsButton({
    title,
    isSelected = false,
}: {
    title: string
    isSelected?: boolean
}) {
    return (
        <div className={cn('rounded-full', isSelected && 'bg-base')}>
            <p className={cn('text-sm px-7 py-2', isSelected && 'text-white')}>
                {title}
            </p>
        </div>
    )
}
