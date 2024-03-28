import { useTranslation } from 'react-i18next'
import SettingsContent from './settings-content'
import { PageLayout } from '@/components/layout/page-layout.tsx'

export default function SettingsPage() {
    const { t } = useTranslation()

    return (
        <PageLayout title={t('settings')}>
            <SettingsContent />
        </PageLayout>
    )
}
