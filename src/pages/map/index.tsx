import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import MapPin from '@/assets/icons/map_pin.svg'

const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify')
const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM)
const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
    reactify.module(ymaps3)
export default function MapPage() {
    return (
        <Fragment>
            <YMap
                location={{ center: [37.61556, 55.75222], zoom: 9 }}
                mode="vector"
            >
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <YMapMarker coordinates={[37.61556, 55.75222]}>
                    <MapPin />
                </YMapMarker>

                <YMapMarker coordinates={[38.61556, 55.75222]}>
                    <MapPin />
                </YMapMarker>
            </YMap>
        </Fragment>
    )
}
