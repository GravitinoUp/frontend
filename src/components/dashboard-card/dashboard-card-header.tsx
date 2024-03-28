import React from 'react'
import { cn } from '@/lib/utils.ts'

export default function DashboardCardHeader({
    title,
    isCollapsed,
    children,
}: {
    title: string
    isCollapsed: boolean
    children: React.ReactNode
}) {
    return (
        <div
            className={cn(
                'p-6 bg-muted flex justify-between items-center w-full',
                isCollapsed ? 'rounded-t-3xl border-b' : 'rounded-3xl'
            )}
        >
            <h2 className="text-2xl">{title}</h2>
            {children}
        </div>
    )
}
