import { CheckpointInterface } from '@/types/interface/checkpoint'

export const checkpointsFormTab = (checkpoint?: CheckpointInterface) => [
    {
        value: 'checkpoint',
        head: 'ПУНКТ ПРОПУСКА',
        isDialog: true,
        height: 755,
        content: <p>{checkpoint?.checkpoint_name}</p>,
    },
]
