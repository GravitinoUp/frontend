import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { savedReportsColumns } from './saved-reports-columns'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import { PageLayout } from '@/components/PageLayout'
import { placeholderQuery } from '@/pages/tasklist/constants'
import { useGetSavedReportsQuery } from '@/redux/api/reports'
import { formatDate, getColumnSorts } from '@/utils/helpers'

export default function SavedReportsPage() {
    const { t } = useTranslation()

    const [savedReportsQuery, setSavedReportsQuery] = useState(placeholderQuery) // TODO filters for saved reports

    const {
        data: reports = { count: 0, data: [] },
        error,
        isFetching,
    } = useGetSavedReportsQuery()

    const formattedReports = reports.data.map((value) => ({
        key: value.report_id,
        name: value.file_alt,
        creationDate: formatDate(value.createdAt),
        creator: 'TODO',
    }))

    if (error) {
        return <ErrorCustomAlert error={error} />
    }

    return (
        <PageLayout title={t('saved.reports')} backButtonEnabled>
            <DataTable
                data={formattedReports}
                columns={savedReportsColumns}
                hasBackground
                getTableInfo={(pageSize, pageIndex, sorting, filter) => {
                    const sorts = getColumnSorts(sorting)

                    setSavedReportsQuery({
                        ...savedReportsQuery,
                        sorts,
                        filter: {
                            ...savedReportsQuery.filter,
                            file_alt: filter,
                        },
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                paginationInfo={{
                    itemCount: reports.count,
                    pageSize: savedReportsQuery.offset.count,
                    pageIndex: savedReportsQuery.offset.page - 1,
                }}
                isLoading={isFetching}
            />
        </PageLayout>
    )
}
