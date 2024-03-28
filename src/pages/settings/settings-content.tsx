import { lazy, Suspense } from 'react'
import i18next from '../../i18n.ts'
import CustomTabs, { TabPage } from '@/components/custom-tabs/custom-tabs'
import Personalization from '@/pages/settings/personalization-tab/personalization.tsx'
import { QrPageSkeleton } from '@/pages/settings/QR-tab/qr-page-skeleton.tsx'
import { SettingsForm } from '@/pages/settings/settings-tab/settings-form'
import { UserDataSkeleton } from '@/pages/settings/settings-tab/user-data-skeleton.tsx'
import { useGetMyUserQuery } from '@/redux/api/users.ts'
import { UserInterface } from '@/types/interface/user.ts'

const QRGeneration = lazy(
    () => import('@/pages/settings/QR-tab/qr-generation.tsx')
)

const tabsPage = (user?: UserInterface): TabPage[] => [
    {
        value: 'settings',
        head: i18next.t('tabs.settings.common'),
        content:
            typeof user !== 'undefined' ? (
                <SettingsForm user={user} />
            ) : (
                <UserDataSkeleton />
            ),
    },
    {
        value: 'personalization',
        head: i18next.t('tabs.settings.customization'),
        content: <Personalization />,
    },
    {
        value: 'qr-generate',
        head: i18next.t('tabs.settings.QR'),
        content: (
            <Suspense fallback={<QrPageSkeleton />}>
                <QRGeneration />
            </Suspense>
        ),
    },
]

export default function SettingsContent() {
    const { data: user } = useGetMyUserQuery()

    return <CustomTabs tabs={tabsPage(user)} />
}
