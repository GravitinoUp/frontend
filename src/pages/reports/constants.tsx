import i18next from 'i18next'

export const reportItems = [
    { to: '', label: i18next.t('reports') },
    { to: '/reports', label: i18next.t('branches') },
    { to: '/reports/checkpoints', label: i18next.t('checkpoints') },
    {
        to: '/reports/checkpoints/organizations',
        label: i18next.t('executors'),
    },
]
