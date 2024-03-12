import { useTranslation } from 'react-i18next'
import { savedReportsColumns } from './saved-reports-columns'
import DataTable from '@/components/data-table/data-table'
import { PageLayout } from '@/components/PageLayout'
import { formatFileSize } from '@/utils/helpers'

export default function SavedReportsPage() {
    const { t } = useTranslation()

    const formattedReports = [
        {
            key: 1,
            name: 'Название',
            creationDate: '01.01.2024',
            size: formatFileSize(2048),
        },
    ]

    return (
        <PageLayout title={t('saved.reports')} backButtonEnabled>
            <DataTable
                data={formattedReports}
                columns={savedReportsColumns}
                hasBackground
                paginationInfo={{ itemCount: 100, pageSize: 10 }}
            />
        </PageLayout>
    )
}
