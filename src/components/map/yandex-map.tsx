import React from "react"
import ReactDOM from "react-dom"
import MapPin from "../map-pin/map-pin"
import { CheckpointInterface } from "@/types/interface/checkpoint"
import { FetchDataInterface } from "@/types/interface/fetch"
import Controls from "./controls"
import { YMap as YMap3 } from "@yandex/ymaps3-types"

const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify')
const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM)
const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
} = reactify.module(ymaps3)

export default function YandexMap({ checkpoints, enableRounded = true }: {
    checkpoints: FetchDataInterface<CheckpointInterface[]>,
    enableRounded?: boolean,
}) {
    let map: YMap3 | null = null

    return (
        <div className='w-full h-full overflow-hidden relative'>
            <YMap
                className={` ${enableRounded ? 'rounded-b-3xl' : ''}`}
                location={{ center: [37.61556, 55.75222], zoom: 4, duration: 200 }}
                zoomStrategy="zoomToPointer"
                mode="vector"
                ref={(ref) => {
                    map = ref
                }}
            >
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <Controls
                    className="right-0 top-1/2 translate-x-[-50%] translate-y-[-50%]"
                    onPlusClick={() => {
                        const newZoom = (map?.zoom ?? 0) + 1
                        map?.setLocation({ zoom: newZoom, duration: 200 })
                    }} onMinusClick={() => {
                        const newZoom = (map?.zoom ?? 4) - 1
                        map?.setLocation({ zoom: newZoom, duration: 200 })
                    }}
                />

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
    )
}