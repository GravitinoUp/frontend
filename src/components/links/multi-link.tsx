import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import SidebarLink from './nav-link.tsx'
import { SingleLink } from '../Navbar'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

function MultiLink({
    open,
    setOpen,
    links,
    title,
    children,
}: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    links: SingleLink[]
    title: string
    children: React.ReactNode
}) {
    const [report, setReport] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        if (!isPathLinks() && !open) {
            setReport(false)
        }
    }, [open, pathname])

    function isPathLinks(): boolean {
        return links.some((link) => link.path === pathname)
    }

    return (
        <>
            <Collapsible open={report && open} onOpenChange={setReport}>
                <div
                    className={
                        isPathLinks()
                            ? `bg-[#F8F8F8] relative items-center justify-center `
                            : 'relative items-center justify-center '
                    }
                >
                    <div
                        className={
                            isPathLinks()
                                ? 'h-[100%] absolute border-solid border-l-4 border-primary'
                                : 'absolute'
                        }
                    >
                        &nbsp;
                    </div>
                    <Button
                        className="w-[100%] justify-start bg-transparent hover:rounded-none"
                        variant="ghost"
                        onClick={() => {
                            if (!open) {
                                setOpen(true)
                                setReport(true)
                            } else {
                                setReport(!report)
                            }
                        }}
                    >
                        <div className="flex items-center justify-center gap-3">
                            {children}

                            {open && (
                                <div
                                    className={
                                        isPathLinks()
                                            ? 'font-[600]'
                                            : 'font-[400]' +
                                              'font-pop text-[15px] font-normal text-[#3F434A]'
                                    }
                                >
                                    {title}
                                </div>
                            )}
                            {open && (
                                <>
                                    {report ? (
                                        <ChevronUp
                                            strokeWidth={
                                                isPathLinks() ? 3 : 2.4
                                            }
                                            size={20}
                                            color="#3F434A"
                                        />
                                    ) : (
                                        <ChevronDown
                                            strokeWidth={
                                                isPathLinks() ? 3 : 2.4
                                            }
                                            size={20}
                                            color="#3F434A"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </Button>
                </div>
                <CollapsibleContent className="space-y-2">
                    <ul>
                        {links.map((item, key) => (
                            <li key={key}>
                                <SidebarLink
                                    path={item.path}
                                    open={open}
                                    title={item.title}
                                >
                                    {item.children}
                                </SidebarLink>
                            </li>
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </>
    )
}

export default MultiLink
