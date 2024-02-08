import { CheckpointInterface } from '@/types/interface/checkpoint'

export const checkpointsFormTab = (checkpoint?: CheckpointInterface) => [
    {
        value: 'checkpoint',
        head: 'ПУНКТ ПРОПУСКА',
        isDialog: true,
        content: <p>{checkpoint?.checkpoint_name}</p>,
    },
]
