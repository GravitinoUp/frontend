import React, { Fragment, useState } from 'react'
import ReactDOM from 'react-dom'
import { placeholderQuery } from '../tasklist/constants'
import MapPin from '@/components/map-pin/map-pin'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import { CheckpointsPayloadInterface } from '@/types/interface/checkpoint'

const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify')
const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM)
const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapControls,
} = reactify.module(ymaps3)

export default function MapPage() {
    const [checkpointsQuery, setCheckpointsQuery] =
        useState<CheckpointsPayloadInterface>({
            ...placeholderQuery,
            sorts: { checkpoint_id: 'ASC' },
        })

    const {
        data: checkpoints = { count: 0, data: [] },
        isError,
        isLoading,
        refetch,
    } = useGetCheckpointsQuery(checkpointsQuery)

    return (
        <Fragment>
            <YMap
                location={{ center: [37.61556, 55.75222], zoom: 9 }}
                mode="vector"
            >
                <YMapControls position={'top left'} />

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
        </Fragment>
    )
}
