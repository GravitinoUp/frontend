import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { Card, CardContent } from '../ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TabPage {
    value: string
    head: string
    count?: number
    isDialog?: boolean
    content: ReactElement
}

export interface TabsProps {
    tabs: TabPage[]
    getCurrentPage?: (value: string) => void
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

export default function CustomTabs({
    tabs,
    getCurrentPage,
    setDialogOpen,
}: TabsProps) {
    return (
        <Tabs
            defaultValue={tabs[0].value}
            className="overflow-auto w-full h-full"
            onValueChange={getCurrentPage}
        >
            <ScrollArea className="w-full">
                <TabsList className="gap-2">
                    {tabs.map((tab, key) => (
                        <TabsTrigger
                            key={key}
                            value={tab.value}
                            className={
                                tabs[0].isDialog
                                    ? 'data-[state=active]:text-primary uppercase'
                                    : ''
                            }
                        >
                            {tab.head}
                            {tab.count && (
                                <div className="ml-2 px-1 py-[2px] bg-border rounded-md">
                                    <p className="text-body-light text-xs">
                                        {tab.count}
                                    </p>
                                </div>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator className="w-full bg-[#E8E9EB]" decorative />
            {tabs.map((tab, key) => {
                if (tab.isDialog) {
                    return (
                        <TabsContent
                            key={key}
                            value={tab.value}
                            className="w-full"
                        >
                            <ScrollArea className="w-full max-h-[691px]">
                                {React.cloneElement(tab.content, {
                                    setDialogOpen,
                                })}
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </TabsContent>
                    )
                } else {
                    return (
                        <TabsContent
                            key={key}
                            value={tab.value}
                            className="w-full mt-8"
                        >
                            <Card className="p-5 content-center rounded-2xl">
                                <CardContent className="p-0">
                                    {tab.content}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )
                }
            })}
        </Tabs>
    )
}
