import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { addDays } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { dashboardReportsColumns } from './dashboard-reports-columns'
import MapFiltersForm from '../map/map-filters-form'
import { placeholderQuery } from '../tasklist/constants'
import FilterIcon from '@/assets/icons/filter_icon.svg'
import MaximizeIcon from '@/assets/icons/maximize_icon.svg'
import MinimizeIcon from '@/assets/icons/minimize_icon.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DashboardCardButton from '@/components/dashboard-card/dashboard-card-button'
import DashboardCardHeader from '@/components/dashboard-card/dashboard-card-header'
import DashboardTabsButton from '@/components/dashboard-card/dashboard-tabs-button'
import DataTable from '@/components/data-table/data-table'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import YandexMap from '@/components/map/yandex-map'
import RoundedButton from '@/components/rounded-button/rounded-button'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import { useGetBranchReportsQuery } from '@/redux/api/reports'
import { CheckpointsPayloadInterface } from '@/types/interface/checkpoint'
import { BranchReportsPayloadInterface } from '@/types/interface/reports'

export function DashboardPage() {
    const [values, setValues] = React.useState(['report', 'map'])
    const [selectedDay, setSelectedDay] = React.useState('today')
    const [isMapExpanded, setisMapExpanded] = React.useState(false)

    const { t } = useTranslation()

    const [branchReportsQuery, setBranchReportsQuery] =
        useState<BranchReportsPayloadInterface>({
            offset: {
                count: 50,
                page: 1,
            },
            filter: {},
            sorts: {},
            period: {
                date_start: new Date(
                    new Date(Date.now()).setHours(0, 0, 0, 0)
                ).toISOString(),
                date_end: new Date(
                    new Date(Date.now()).setHours(23, 59, 59, 999)
                ).toISOString(),
            },
        })

    const {
        data = { count: 0, data: [] },
        isFetching: isReportsFetching,
        isError: isReportsError,
    } = useGetBranchReportsQuery(branchReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.branch.branch_id,
        id: row.branch.branch_id,
        name: row.branch.branch_name,
        completed_percent: row.completed_percent,
        completed_count: row.completed_count,
        checked_percent: row.checked_percent,
        checked_count: row.checked_count,
    }))

    const [checkpointsQuery, setCheckpointQuery] =
        useState<CheckpointsPayloadInterface>({
            ...placeholderQuery,
            sorts: { checkpoint_id: 'ASC' },
        })

    const {
        data: checkpoints = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetCheckpointsQuery(checkpointsQuery)

    const [formOpen, setFormOpen] = useState(false)

    return (
        <div className="w-full h-full">
            {isError || (isReportsError && <CustomAlert />)}
            {isMapExpanded ? (
                <div className="w-full h-full flex flex-col border-2">
                    <div className="border-b-2 bg-white flex justify-between items-center px-6">
                        <h2 className="text-2xl font-medium py-6">
                            {t('map.title')}
                        </h2>
                        <div className="flex flex-row gap-4">
                            <DialogWindow
                                open={formOpen}
                                setOpen={setFormOpen}
                                trigger={
                                    <RoundedButton
                                        icon={<FilterIcon />}
                                        onClick={() => {}}
                                    />
                                }
                                content={
                                    <MapFiltersForm
                                        handleSubmit={(data) => {
                                            setCheckpointQuery({
                                                ...checkpointsQuery,
                                                filter: {
                                                    checkpoint_type:
                                                        data.checkpoint_types,
                                                },
                                                report_filter: {
                                                    min_completed_percent:
                                                        Number(data.minPercent),
                                                    max_completed_percent:
                                                        Number(data.maxPercent),
                                                },
                                            })

                                            setFormOpen(false)
                                        }}
                                        data={{
                                            checkpoint_types:
                                                checkpointsQuery.filter
                                                    ?.checkpoint_type ?? [],
                                            minPercent:
                                                checkpointsQuery.report_filter?.min_completed_percent?.toString() ??
                                                '0',
                                            maxPercent:
                                                checkpointsQuery.report_filter?.max_completed_percent?.toString() ??
                                                '100',
                                        }}
                                        setDialogOpen={(value) => {
                                            setFormOpen(value)

                                            setCheckpointQuery({
                                                ...checkpointsQuery,
                                                filter: {},
                                                report_filter: {},
                                            })
                                        }}
                                    />
                                }
                            />
                            <RoundedButton
                                icon={<MinimizeIcon />}
                                onClick={() => {
                                    setisMapExpanded(!isMapExpanded)
                                }}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[100%]">
                            <LoadingSpinner className="w-16 h-16 text-primary" />
                        </div>
                    ) : (
                        <YandexMap
                            checkpoints={checkpoints}
                            enableRounded={false}
                        />
                    )}
                </div>
            ) : (
                <div className="w-full h-full p-7">
                    <div className="bg-white w-full h-full rounded-3xl p-5">
                        <Accordion
                            type="multiple"
                            value={values}
                            onValueChange={setValues}
                        >
                            <AccordionItem
                                className="rounded-3xl mb-4 border"
                                value="report"
                            >
                                <DashboardCardHeader
                                    title={t('reports')}
                                    isCollapsed={values.includes('report')}
                                >
                                    <div className="flex items-center gap-2">
                                        <Tabs
                                            defaultValue="today"
                                            className="rounded-full border p-[2px]"
                                            onValueChange={(value) => {
                                                setSelectedDay(value)

                                                setBranchReportsQuery({
                                                    ...branchReportsQuery,
                                                    period: {
                                                        date_start: addDays(
                                                            new Date(
                                                                Date.now()
                                                            ).setHours(
                                                                0,
                                                                0,
                                                                0,
                                                                0
                                                            ),
                                                            value == 'yesterday'
                                                                ? -1
                                                                : 0
                                                        ).toISOString(),
                                                        date_end: addDays(
                                                            new Date(
                                                                Date.now()
                                                            ).setHours(
                                                                23,
                                                                59,
                                                                59,
                                                                999
                                                            ),
                                                            value == 'yesterday'
                                                                ? -1
                                                                : 0
                                                        ).toISOString(),
                                                    },
                                                })
                                            }}
                                        >
                                            <TabsList className="flex items-center">
                                                <TabsTrigger value="yesterday">
                                                    <DashboardTabsButton
                                                        title={t(
                                                            'yesterday.title'
                                                        )}
                                                        isSelected={
                                                            selectedDay ==
                                                            'yesterday'
                                                        }
                                                    />
                                                </TabsTrigger>
                                                <div className="mx-1 py-3 w-[1px] bg-border"></div>
                                                <TabsTrigger value="today">
                                                    <DashboardTabsButton
                                                        title={t('today.title')}
                                                        isSelected={
                                                            selectedDay ==
                                                            'today'
                                                        }
                                                    />
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <DashboardCardButton
                                            icon={
                                                values.includes('report') ? (
                                                    <ChevronDown size={20} />
                                                ) : (
                                                    <ChevronUp size={20} />
                                                )
                                            }
                                            onClick={() => {
                                                values.includes('report')
                                                    ? setValues(
                                                          values.filter(
                                                              (value) =>
                                                                  value !=
                                                                  'report'
                                                          )
                                                      )
                                                    : setValues([
                                                          ...values,
                                                          'report',
                                                      ])
                                            }}
                                        />
                                    </div>
                                </DashboardCardHeader>
                                <AccordionContent className="overflow-auto">
                                    <ScrollArea className="w-full h-[600px]">
                                        <DataTable
                                            data={formattedReports}
                                            columns={dashboardReportsColumns}
                                            hasBackground
                                            getTableInfo={(
                                                pageSize,
                                                pageIndex,
                                                sorting,
                                                filter
                                            ) => {
                                                const sorts = sorting.reduce(
                                                    (acc, value) => {
                                                        const currentSortOrder =
                                                            value.desc
                                                                ? 'DESC'
                                                                : 'ASC'

                                                        switch (value.id) {
                                                            case 'id':
                                                                return {
                                                                    ...acc,
                                                                    branch: {
                                                                        branch_id:
                                                                            currentSortOrder,
                                                                    },
                                                                }
                                                            case 'name':
                                                                return {
                                                                    ...acc,
                                                                    branch: {
                                                                        branch_name:
                                                                            currentSortOrder,
                                                                    },
                                                                }
                                                            default:
                                                                return {
                                                                    ...acc,
                                                                    report: {
                                                                        [`${value.id}`]:
                                                                            currentSortOrder,
                                                                    },
                                                                }
                                                        }
                                                    },
                                                    {}
                                                )

                                                setBranchReportsQuery({
                                                    ...branchReportsQuery,
                                                    sorts,
                                                    filter: {
                                                        ...branchReportsQuery.filter,
                                                        branch: {
                                                            branch_name: filter,
                                                        },
                                                    },
                                                    offset: {
                                                        count: pageSize,
                                                        page: pageIndex + 1,
                                                    },
                                                })
                                            }}
                                            paginationInfo={{
                                                itemCount: data.count,
                                                pageSize:
                                                    branchReportsQuery.offset
                                                        .count,
                                                pageIndex:
                                                    branchReportsQuery.offset
                                                        .page,
                                            }}
                                            isLoading={isReportsFetching}
                                        />
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem
                                className="rounded-3xl mb-4 border"
                                value="map"
                            >
                                <DashboardCardHeader
                                    title={t('map.title')}
                                    isCollapsed={values.includes('map')}
                                >
                                    <div className="flex items-center gap-2">
                                        <DashboardCardButton
                                            icon={<MaximizeIcon />}
                                            onClick={() => {
                                                setisMapExpanded(!isMapExpanded)
                                            }}
                                        />
                                        <DashboardCardButton
                                            icon={
                                                values.includes('map') ? (
                                                    <ChevronDown size={20} />
                                                ) : (
                                                    <ChevronUp size={20} />
                                                )
                                            }
                                            onClick={() => {
                                                values.includes('map')
                                                    ? setValues(
                                                          values.filter(
                                                              (value) =>
                                                                  value != 'map'
                                                          )
                                                      )
                                                    : setValues([
                                                          ...values,
                                                          'map',
                                                      ])
                                            }}
                                        />
                                    </div>
                                </DashboardCardHeader>
                                <AccordionContent className="w-full h-[600px]">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-[100%]">
                                            <LoadingSpinner className="w-16 h-16 text-primary" />
                                        </div>
                                    ) : (
                                        <YandexMap checkpoints={checkpoints} />
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            )}
        </div>
    )
}
