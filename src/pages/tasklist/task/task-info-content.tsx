import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageCarousel from '@/components/image-carousel/image-carousel'
import ImageCarouselDialog from '@/components/image-carousel/image-carousel-dialog'
import OrderStatus from '@/components/order-status/order-status'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { OrderInterface } from '@/types/interface/orders'
import { formatDate } from '@/utils/helpers'

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
    order: OrderInterface
}

const TaskInfoContent = ({ order }: TaskInfoContentProps) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [dialogStartIndex, setDialogStartIndex] = useState(0)

    return (
        <Fragment>
            <ImageCarouselDialog
                files={order.files}
                startIndex={dialogStartIndex}
                open={open}
                setOpen={setOpen}
            />
            <OrderStatus status={order.order_status.order_status_name} />
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
                        content={order.facility.checkpoint.checkpoint_name}
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
                        content={order.facility.checkpoint.branch.branch_name}
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
                files={order.files}
                onShowClick={(index) => {
                    setDialogStartIndex(index)
                    setOpen(true)
                }}
            />
        </Fragment>
    )
}

export default TaskInfoContent
