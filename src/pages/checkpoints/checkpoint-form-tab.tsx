import AddCheckpointForm from './add-checkpoint-form.tsx'
import i18next from '../../i18n.ts'
import { CheckpointInterface } from '@/types/interface/checkpoint'

export const checkpointsFormTab = (checkpoint?: CheckpointInterface) => [
    {
        value: 'checkpoint',
        head: i18next.t('checkpoint'),
        isDialog: true,
        content: <AddCheckpointForm checkpoint={checkpoint} />,
    },
]
