import { useParams } from 'react-router-dom'
import OrderJournalContent from './order-journal-content.tsx'
import i18next from '../../../i18n.ts'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import { PageLayout } from '@/components/PageLayout'
import TaskInfoContent from '@/pages/tasklist/task/task-info-content.tsx'

const taskPageTabs = (order_id: number) => [
    {
        value: 'taskInfo',
        head: i18next.t('tabs.task.info'),
        content: <TaskInfoContent order_id={order_id} />,
    },
    {
        value: 'taskHistory',
        head: i18next.t('tabs.task.history'),
        content: <OrderJournalContent order_id={order_id} />,
    },
]

export default function TaskPage() {
    const { id } = useParams()

    return (
        <PageLayout backButtonEnabled>
            <CustomTabs tabs={taskPageTabs(Number(id))} />
        </PageLayout>
    )
}
