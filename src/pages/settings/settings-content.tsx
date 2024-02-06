import { AlertsCard } from './settings-tabs/alerts-card'
import { SettingsForm } from './settings-tabs/settings-form'
import CustomTabs, { TabPage } from '@/components/custom-tabs/custom-tabs'

const tabsPage: TabPage[] = [
    {
        value: 'settings',
        head: 'Общие настройки',
        content: <SettingsForm />,
    },
    {
        value: 'decoration',
        head: 'Оформление',
        content: <>2</>,
    },
    {
        value: 'alerts',
        head: 'Уведомления',
        content: <AlertsCard />,
    },
]

export default function SettingsContent() {
    return <CustomTabs tabs={tabsPage} />
}
