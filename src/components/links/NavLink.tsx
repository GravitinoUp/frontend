import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

function SidebarLink({
    open,
    path,
    count,
    title,
    children,
}: {
    open: boolean
    path: string
    count: number | null
    title: string
    children: React.ReactNode
}) {
    const { pathname } = useLocation()
    const isOnCurrentPath = path === pathname

    if (isOnCurrentPath) {
        document.title = title
    }

    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                'flex bg-transparent' +
                (isActive ? 'border-solid border-l-4 border-[#0784D1]' : '')
            }
        >
            <Button
                className={cn(
                    'w-[100%] h-[56px] relative justify-start bg-transparent rounded-none',
                    isOnCurrentPath && 'bg-muted'
                )}
                variant="ghost"
            >
                <div className="flex items-center">
                    {children}
                    <div>
                        {open && (
                            <div
                                className={`ml-3 font-pop text-[16px] text-[#3F434A] whitespace-pre-line text-start ${
                                    isOnCurrentPath
                                        ? 'font-[600]'
                                        : 'font-[400]'
                                }`}
                            >
                                {title}
                            </div>
                        )}
                    </div>
                    {count && (
                        <div className=" absolute right-2 items-center justify-center">
                            {count !== 0 && (
                                <div className="w-[20px] h-[20px] rounded-full bg-[#0784D1] flex justify-center items-center">
                                    <p className="text-white text-[12px]">
                                        {count < 10 ? `${count}` : '+9'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Button>
        </NavLink>
    )
}

export default SidebarLink
