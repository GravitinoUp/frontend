import React from "react"
import ReactDOM from "react-dom"
import MapPin from "../map-pin/map-pin"
import { CheckpointInterface } from "@/types/interface/checkpoint"
import { FetchDataInterface } from "@/types/interface/fetch"
import Controls from "./controls"

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
    return (
        <div className='w-full h-full overflow-hidden'>
            <YMap
                className={` ${enableRounded ? 'rounded-b-3xl' : ''}`}
                location={{ center: [37.61556, 55.75222], zoom: 4 }}
                mode="vector"
            >
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <Controls
                    className=""
                    onPlusClick={() => {
                        throw new Error("Function not implemented.")
                    }} onMinusClick={() => {
                        throw new Error("Function not implemented.")
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