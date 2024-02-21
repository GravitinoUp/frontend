import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangeStatusForm from './change-status-form'
import { placeholderQuery } from '../constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import FormDialog from '@/components/form-dialog/form-dialog'
import ImageCarousel from '@/components/image-carousel/image-carousel'
import OrderStatus from '@/components/order-status/order-status'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useGetOrdersQuery } from '@/redux/api/orders'
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
    order_id: number
}

const TaskInfoContent = ({ order_id }: TaskInfoContentProps) => {
    const { t } = useTranslation()
    const [statusFormOpen, setStatusFormOpen] = useState(false)

    const {
        data: orders = [],
        isLoading: orderLoading,
        isError: orderError,
        isSuccess: orderSuccess,
    } = useGetOrdersQuery({
        ...placeholderQuery,
        filter: { order_id: order_id },
    })
    const order = orders[0]

    return (
        <Fragment>
            {orderLoading && <LoadingSpinner />}
            {orderError && <CustomAlert message={t('default.error.message')} />}
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
                    <ImageCarousel files={order.files} />
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
