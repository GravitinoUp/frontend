import i18next from '../../i18n.ts'
import CustomTabs, { TabPage } from '@/components/custom-tabs/custom-tabs'
import Personalization from '@/pages/settings/personalization-tab/personalization.tsx'
import { SettingsForm } from '@/pages/settings/settings-tab/settings-form'

const tabsPage: TabPage[] = [
    {
        value: 'settings',
        head: i18next.t('tabs.settings.common'),
        content: <SettingsForm />,
    },
    {
        value: 'decoration',
        head: i18next.t('tabs.settings.customization'),
        content: <Personalization />,
    },
]

export default function SettingsContent() {
    return <CustomTabs tabs={tabsPage} />
}
