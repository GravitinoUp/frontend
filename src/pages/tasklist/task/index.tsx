import { useLocation } from 'react-router-dom'
import TaskInfoContent from './task-info-content'
import i18next from '../../../i18n.ts'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import { PageLayout } from '@/components/PageLayout'
import { OrderInterface } from '@/types/interface/orders'

const taskPageTabs = (order: OrderInterface) => [
    {
        value: 'taskInfo',
        head: i18next.t('tabs.task.info'),
        content: <TaskInfoContent order={order} />,
    },
    {
        value: 'taskHistory',
        head: i18next.t('tabs.task.history'),
        content: <p>PLACEHOLDER</p>,
    },
]

export default function TaskPage() {
    const { state } = useLocation()
    const order: OrderInterface = state.order

    return (
        <PageLayout title={order.task.task_name} backButtonEnabled>
            <CustomTabs tabs={taskPageTabs(order)} />
        </PageLayout>
    )
}
