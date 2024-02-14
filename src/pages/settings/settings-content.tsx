import { AlertsCard } from './settings-tabs/alerts-card'
import { SettingsForm } from './settings-tabs/settings-form'
import i18next from '../../i18n.ts'
import CustomTabs, { TabPage } from '@/components/custom-tabs/custom-tabs'

const tabsPage: TabPage[] = [
    {
        value: 'settings',
        head: i18next.t('tabs.settings.common'),
        content: <SettingsForm />,
    },
    {
        value: 'decoration',
        head: i18next.t('tabs.settings.customization'),
        content: <>2</>,
    },
    {
        value: 'alerts',
        head: i18next.t('tabs.settings.notifications'),
        content: <AlertsCard />,
    },
]

export default function SettingsContent() {
    return <CustomTabs tabs={tabsPage} />
}
