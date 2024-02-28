import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { placeholderQuery } from "../tasklist/constants";
import MaximizeIcon from '@/assets/icons/maximize_icon.svg'
import SettingsIcon from '@/assets/icons/settings_icon.svg'
import { CustomAlert } from "@/components/custom-alert/custom-alert";
import DashboardCardButton from "@/components/dashboard-card/dashboard-card-button";
import DashboardCardHeader from "@/components/dashboard-card/dashboard-card-header";
import MapPin from "@/components/map-pin/map-pin";
import { LoadingSpinner } from "@/components/spinner/spinner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useGetCheckpointsQuery } from "@/redux/api/checkpoints";
import { CheckpointsPayloadInterface } from "@/types/interface/checkpoint";

const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify')
const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM)
const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapControls,
} = reactify.module(ymaps3)

export function DashboardPage() {
    const [values, setValues] = React.useState(['report', 'map']);

    const { t } = useTranslation()

    const [checkpointsQuery] =
        useState<CheckpointsPayloadInterface>({
            ...placeholderQuery,
            sorts: { checkpoint_id: 'ASC' },
        })

    const {
        data: checkpoints = { count: 0, data: [] },
        isError,
        isLoading,
    } = useGetCheckpointsQuery(checkpointsQuery)

    return <div className="w-full h-full p-7">
        {isError && <CustomAlert />}
        <div className="bg-white rounded-3xl w-full h-full p-5">
            <Accordion type="multiple" value={values} onValueChange={setValues}>
                <AccordionItem className="rounded-3xl mb-4 border" value="report">
                    <AccordionTrigger className="p-0" hideButton={true}>
                        <DashboardCardHeader title={t('reports')} isCollapsed={values.includes('report')}>
                            <div className="flex items-center gap-2">
                                <DashboardCardButton
                                    icon={<SettingsIcon />}
                                    onClick={() => { }}
                                />
                                <DashboardCardButton
                                    icon={values.includes('report') ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                    onClick={() => { setValues(values.filter((value) => value != 'report')) }}
                                />
                            </div>
                        </DashboardCardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                        TODO REPORTS
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className="rounded-3xl mb-4 border" value="map">
                    <AccordionTrigger className="p-0" hideButton={true}>
                        <DashboardCardHeader title={t('map.title')} isCollapsed={values.includes('map')}>
                            <div className="flex items-center gap-2">
                                <DashboardCardButton icon={<MaximizeIcon />} onClick={() => { }} />
                                <DashboardCardButton
                                    icon={values.includes('map') ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                    onClick={() => { setValues(values.filter((value) => value != 'map')) }}
                                />
                            </div>
                        </DashboardCardHeader>
                    </AccordionTrigger>
                    <AccordionContent className="h-[400px]">
                        {isLoading && <LoadingSpinner />}
                        <div className='w-full h-full overflow-hidden'>
                            <YMap
                                className="rounded-b-3xl"
                                location={{ center: [37.61556, 55.75222], zoom: 4 }}
                                mode="vector"
                            >
                                <YMapControls position='right' />

                                <YMapDefaultSchemeLayer />
                                <YMapDefaultFeaturesLayer />

                                {checkpoints.data.map((checkpoint, index) => (
                                    <YMapMarker
                                        key={index}
                                        coordinates={[checkpoint.lat, checkpoint.lng]}
                                    >
                                        <MapPin checkpoint={checkpoint} />
                                    </YMapMarker>
                                ))}
                            </YMap>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
