import { Fragment, useState } from 'react'
import CloseRounded from '@/assets/icons/close_rounded.svg'
import DownloadIcon from '@/assets/icons/download.svg'
import DownloadAllIcon from '@/assets/icons/download_all.svg'
import ViewIcon from '@/assets/icons/view.svg'
import OrderStatus from '@/components/order-status/order-status'
import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
    const [open, setOpen] = useState(false)

    return (
        <Fragment>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="bg-transparent border-none rounded-none w-full max-w-full h-screen shadow-none"
                    onOpenAutoFocus={(e) => e.preventDefault}
                    closeIcon={<CloseRounded />}
                >
                    <Carousel className="border-none rounded-xl mt-10 p-3 select-none">
                        <CarouselContent className="h-full">
                            {order.files?.map((value) => (
                                <CarouselItem
                                    key={value}
                                    className="flex justify-center"
                                >
                                    <img
                                        src={value}
                                        className="object-none align-middle"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </DialogContent>
            </Dialog>
            <OrderStatus status={order.order_status.order_status_name} />
            <div className="flex">
                <div className="w-full mr-[100px]">
                    <TaskInfoField
                        title="Название"
                        content={order.order_name}
                    />
                    <TaskInfoField
                        title="Описание"
                        content={order.order_description}
                        multiline
                    />
                    <TaskInfoField
                        title="Пункт пропуска"
                        content={order.facility.checkpoint.checkpoint_name}
                    />
                    <TaskInfoField
                        title="Исполнитель"
                        content={order.executor.full_name}
                    />
                    <TaskInfoField
                        title="Приоритет"
                        content={order.priority.priority_name}
                    />
                </div>
                <div className="w-full mr-[100px]">
                    <TaskInfoField
                        title="Создатель задачи"
                        content={order.creator.person.last_name}
                    />
                    <TaskInfoField
                        title="Филиал"
                        content={order.facility.checkpoint.branch.branch_name}
                    />
                    <TaskInfoField
                        title="Дата создания"
                        content={formatDate(order.createdAt)}
                    />
                    <TaskInfoField
                        title="Дата завершения"
                        content={
                            order.ended_at_datetime
                                ? formatDate(order.ended_at_datetime)
                                : 'Не завершено'
                        }
                    />
                    <TaskInfoField
                        title="Тип задачи"
                        content={order.task.category.category_name}
                    />
                </div>
            </div>
            <Carousel className="w-fit border rounded-xl mt-10 p-3 select-none">
                <CarouselContent>
                    {order.files?.map((value) => (
                        <CarouselItem key={value} className="basis-auto">
                            <div className="relative rounded-xl overflow-hidden group">
                                <div className="absolute w-full h-full flex justify-center items-center bg-black bg-opacity-50 invisible group-hover:visible">
                                    <Button
                                        variant="ghost"
                                        className="p-2 hover:bg-white hover:bg-opacity-10"
                                        onClick={() => setOpen(true)}
                                    >
                                        <ViewIcon />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="p-2 hover:bg-white hover:bg-opacity-10"
                                        onClick={() => {}}
                                    >
                                        <DownloadIcon />
                                    </Button>
                                </div>
                                <img
                                    src={value}
                                    className="w-[90px] h-[90px] object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                    <CarouselItem className="basis-auto overflow-hidden">
                        <Button
                            variant="ghost"
                            className="w-[90px] h-[90px] flex flex-col justify-center items-center rounded-xl"
                            onClick={() => {}}
                        >
                            <DownloadAllIcon />
                            <p className="text-xs">Скачать все</p>
                        </Button>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </Fragment>
    )
}

export default TaskInfoContent
