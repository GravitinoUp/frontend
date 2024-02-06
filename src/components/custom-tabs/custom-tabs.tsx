import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { Card, CardContent } from '../ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TabPage {
    value: string
    head: string
    isDialog?: boolean
    height?: number
    content: ReactElement
}

export interface TabsProps {
    tabs: TabPage[]
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

export default function CustomTabs({ tabs, setDialogOpen }: TabsProps) {
    return (
        <Tabs
            defaultValue={tabs[0].value}
            className="overflow-auto  w-full h-full"
        >
            <TabsList className="gap-2">
                {tabs.map((tab, key) => (
                    <TabsTrigger key={key} value={tab.value}>
                        {tab.head}
                    </TabsTrigger>
                ))}
            </TabsList>
            <Separator className="w-full bg-[#E8E9EB]" decorative />

            {tabs.map((tab, key) => {
                if (tab.isDialog) {
                    const height = 'h-[' + `${tab.height}` + 'px]'

                    return (
                        <TabsContent
                            key={key}
                            value={tab.value}
                            className="w-full"
                        >
                            <ScrollArea className={'w-full ' + `${height}`}>
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
