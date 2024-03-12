import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { placeholderQuery } from './constants.ts'
import ChangeStatusForm from './task/change-status-form.tsx'
import DownloadAllIcon from '@/assets/icons/download_all.svg'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import FormDialog from '@/components/form-dialog/form-dialog.tsx'
import ImageCarouselButton from '@/components/image-carousel/image-carousel-button.tsx'
import ImageCarousel from '@/components/image-carousel/image-carousel.tsx'
import OrderStatus from '@/components/order-status/order-status.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { TaskInfoSkeleton } from '@/pages/tasklist/task/task-info-skeleton.tsx'
import { useGetPersonalOrdersQuery } from '@/redux/api/orders.ts'
import { formatDate } from '@/utils/helpers.ts'

interface TaskInfoFieldProps {
    title?: string | null
    content?: string | null
    multiline?: boolean
}

const TaskInfoField = ({
    title = '',
    content = '',
    multiline = false,
}: TaskInfoFieldProps) => (
    <div className="pb-4">
        <p className="font-medium text-foreground text-xl leading-8">{title}</p>
        <div className="mt-6">
            {multiline ? (
                <Textarea
                    value={content ?? ''}
                    className="border-[0px] border-b-[1px] rounded-none text-base"
                    readOnly
                />
            ) : (
                <Input
                    value={content ?? ''}
                    className="border-[0px] border-b-[1px] rounded-none text-base"
                    readOnly
                />
            )}
        </div>
    </div>
)

interface TaskInfoContentProps {
    order_id: number
}

const TaskInfoContent = ({ order_id }: TaskInfoContentProps) => {
    const { t } = useTranslation()
    const [statusFormOpen, setStatusFormOpen] = useState(false)

    const {
        data: orders = { count: 0, data: [] },
        isLoading: orderLoading,
        error: orderError,
        isSuccess: orderSuccess,
    } = useGetPersonalOrdersQuery({
        ...placeholderQuery,
        filter: { order_id: order_id },
    })
    const order = orders.data[0]

    if (orderLoading) {
        return <TaskInfoSkeleton />
    }

    return (
        <Fragment>
            {orderError && <ErrorCustomAlert error={orderError} />}
            {orderSuccess && (
                <Fragment>
                    <OrderStatus
                        status={order.order_status.order_status_name}
                    />
                    <div className="flex">
                        <div className="w-full mr-[100px]">
                            <TaskInfoField
                                title={t('title')}
                                content={order.order_name}
                            />
                            <TaskInfoField
                                title={t('description')}
                                content={order.order_description}
                                multiline
                            />
                            <TaskInfoField
                                title={t('checkpoint')}
                                content={
                                    order.facility.checkpoint.checkpoint_name
                                }
                            />
                            <TaskInfoField
                                title={t('executor')}
                                content={order.executor.full_name}
                            />
                            <TaskInfoField
                                title={t('priority')}
                                content={order.priority.priority_name}
                            />
                        </div>
                        <div className="w-full mr-[100px]">
                            <TaskInfoField
                                title={t('task.creator')}
                                content={order.creator.person.last_name}
                            />
                            <TaskInfoField
                                title={t('branch')}
                                content={
                                    order.facility.checkpoint.branch.branch_name
                                }
                            />
                            <TaskInfoField
                                title={t('creation.date')}
                                content={formatDate(order.createdAt)}
                            />
                            <TaskInfoField
                                title={t('end.date')}
                                content={
                                    order.ended_at_datetime
                                        ? formatDate(order.ended_at_datetime)
                                        : t('not.finished')
                                }
                            />
                            <TaskInfoField
                                title={t('task.type')}
                                content={order.task.category.category_name}
                            />
                        </div>
                    </div>
                    <ImageCarousel
                        files={orders.data[0].files.map((value, index) => ({
                            id: String(index),
                            fileURL: value,
                        }))}
                        suffixButton={
                            <ImageCarouselButton
                                icon={<DownloadAllIcon />}
                                label={t('download.all')}
                                onClick={() => {}}
                            />
                        }
                    />
                    <FormDialog
                        open={statusFormOpen}
                        setOpen={setStatusFormOpen}
                        actionButton={
                            <Button className="px-8 mt-16">
                                {t('button.action.change.status')}
                            </Button>
                        }
                        addItemForm={
                            <ChangeStatusForm
                                order={order}
                                setDialogOpen={setStatusFormOpen}
                            />
                        }
                    />
                </Fragment>
            )}
        </Fragment>
    )
}

export default TaskInfoContent
