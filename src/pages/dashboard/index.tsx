import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { placeholderQuery } from "../tasklist/constants";
import SettingsIcon from '@/assets/icons/settings_icon.svg'
import FilterIcon from '@/assets/icons/filter_icon.svg'
import MinimizeIcon from '@/assets/icons/minimize_icon.svg'
import MaximizeIcon from '@/assets/icons/maximize_icon.svg'
import { CustomAlert } from "@/components/custom-alert/custom-alert";
import DashboardCardButton from "@/components/dashboard-card/dashboard-card-button";
import DashboardCardHeader from "@/components/dashboard-card/dashboard-card-header";
import { LoadingSpinner } from "@/components/spinner/spinner";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { useGetCheckpointsQuery } from "@/redux/api/checkpoints";
import { CheckpointsPayloadInterface } from "@/types/interface/checkpoint";
import YandexMap from "@/components/map/yandex-map";
import RoundedButton from "@/components/rounded-button/rounded-button";
import FormDialog from "@/components/form-dialog/form-dialog";
import MapFiltersForm from "../map/map-filters-form";
import ReportsContent from "./reports-content";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import DashboardTabsButton from "@/components/dashboard-card/dashboard-tabs-button";
import { BranchReportsPayloadInterface } from "@/types/interface/reports";
import { useGetBranchReportsQuery } from "@/redux/api/reports";
import DataTable from "@/components/data-table/data-table";
import { dashboardReportsColumns } from "./dashboard-reports-columns";
import { addDays } from "date-fns";

export function DashboardPage() {
    const [values, setValues] = React.useState(['report', 'map']);
    const [selectedDay, setSelectedDay] = React.useState('today');
    const [isMapExpanded, setisMapExpanded] = React.useState(false);

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
                period_start: new Date(new Date(Date.now()).setHours(0, 0, 0, 0)).toISOString(),
                period_end: new Date(new Date(Date.now()).setHours(23, 59, 59, 999)).toISOString(),
            },
        })

    const {
        data = { count: 0, data: [] },
        isLoading: isReportsLoading,
        isError: isReportsError,
        refetch,
    } = useGetBranchReportsQuery(branchReportsQuery)

    const formattedReports = data.data.map((row) => ({
        key: row.branch.branch_id,
        id: row.branch.branch_id,
        name: row.branch.branch_name,
        completedPercent: row.completed_percent,
        completedCount: row.completed_count,
        checkedPercent: row.checked_percent,
        checkedCount: row.checked_count,
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

    return <div className="w-full h-full">
        {isError || isReportsError && <CustomAlert />}
        {isLoading && isReportsLoading && <LoadingSpinner />}
        {
            isMapExpanded ?
                <div className='w-full h-full flex flex-col border-2'>
                    <div className='border-b-2 bg-white flex justify-between items-center px-6'>
                        <h2 className='text-2xl font-medium py-6'>{t('map.title')}</h2>
                        <div className='flex flex-row gap-4'>
                            <FormDialog
                                open={formOpen}
                                setOpen={setFormOpen}
                                actionButton={<RoundedButton icon={<FilterIcon />} onClick={() => { }} />}
                                addItemForm={
                                    <MapFiltersForm handleSubmit={(data) => {
                                        setCheckpointQuery({
                                            ...checkpointsQuery,
                                            filter: {
                                                checkpoint_type: data.checkpoint_types,
                                            }
                                        })

                                        setFormOpen(false)
                                    }} data={{ checkpoint_types: checkpointsQuery.filter?.checkpoint_type ?? [], minPercent: '0', maxPercent: '100' }} />
                                }
                            />
                            <RoundedButton icon={<MinimizeIcon />} onClick={() => {
                                setisMapExpanded(!isMapExpanded)
                            }} />
                        </div>
                    </div>
                    <YandexMap checkpoints={checkpoints} enableRounded={false} />
                </div>
                :
                <div className="w-full h-full p-7">
                    <div className="bg-white w-full h-full rounded-3xl p-5">
                        <Accordion type="multiple" value={values} onValueChange={setValues}>
                            <AccordionItem className="rounded-3xl mb-4 border" value="report">
                                <DashboardCardHeader title={t('reports')} isCollapsed={values.includes('report')}>
                                    <div className="flex items-center gap-2">
                                        <Tabs
                                            defaultValue="today"
                                            className="rounded-full border p-[2px]"
                                            onValueChange={(value) => {
                                                setSelectedDay(value)

                                                setBranchReportsQuery({
                                                    ...branchReportsQuery,
                                                    period: {
                                                        period_start: addDays(new Date(Date.now()).setHours(0, 0, 0, 0), value == 'yesterday' ? -1 : 0).toISOString(),
                                                        period_end: addDays(new Date(Date.now()).setHours(23, 59, 59, 999), value == 'yesterday' ? -1 : 0).toISOString(),
                                                    },
                                                })
                                            }}>
                                            <TabsList className="flex items-center">
                                                <TabsTrigger value="yesterday"><DashboardTabsButton title={"Вчера"} isSelected={selectedDay == 'yesterday'} /></TabsTrigger>
                                                <div className="mx-1 py-3 w-[1px] bg-border"></div>
                                                <TabsTrigger value="today"><DashboardTabsButton title={"Сегодня"} isSelected={selectedDay == 'today'} /></TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <DashboardCardButton
                                            icon={<SettingsIcon />}
                                            onClick={() => { }}
                                        />
                                        <DashboardCardButton
                                            icon={values.includes('report') ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                            onClick={() => { values.includes('report') ? setValues(values.filter((value) => value != 'report')) : setValues([...values, 'report']) }}
                                        />
                                    </div>
                                </DashboardCardHeader>
                                <AccordionContent>
                                    <DataTable
                                        data={formattedReports}
                                        columns={dashboardReportsColumns}
                                        hasBackground
                                        getPaginationInfo={(pageSize, pageIndex) => {
                                            setBranchReportsQuery({
                                                ...branchReportsQuery,
                                                offset: { count: pageSize, page: pageIndex + 1 },
                                            })
                                        }}
                                        paginationInfo={{
                                            itemCount: data.count,
                                            pageSize: branchReportsQuery.offset.count,
                                        }}
                                        isLoading={isLoading}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem className="rounded-3xl mb-4 border" value="map">
                                <DashboardCardHeader title={t('map.title')} isCollapsed={values.includes('map')}>
                                    <div className="flex items-center gap-2">
                                        <DashboardCardButton icon={<MaximizeIcon />} onClick={() => { setisMapExpanded(!isMapExpanded) }} />
                                        <DashboardCardButton
                                            icon={values.includes('map') ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                            onClick={() => { values.includes('map') ? setValues(values.filter((value) => value != 'map')) : setValues([...values, 'map']) }}
                                        />
                                    </div>
                                </DashboardCardHeader>
                                <AccordionContent className="w-full h-[600px]">
                                    <YandexMap checkpoints={checkpoints} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

        }

    </div>
}
