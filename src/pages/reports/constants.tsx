import i18next from '../../i18n.ts'
import {
    REPORTS,
    REPORTS_CHECKPOINTS,
    REPORTS_ORGANIZATIONS,
} from '@/routes.ts'

export const reportItems = [
    { to: '', label: i18next.t('reports') },
    { to: REPORTS, label: i18next.t('branches') },
    { to: REPORTS_CHECKPOINTS, label: i18next.t('checkpoints') },
    {
        to: REPORTS_ORGANIZATIONS,
        label: i18next.t('executors'),
    },
]
