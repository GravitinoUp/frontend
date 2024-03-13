import { Dispatch, SetStateAction, useMemo } from 'react'
import { parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import CalendarIcon from '@/assets/icons/Calendar.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert.tsx'
import CustomForm, { useForm } from '@/components/form/form.tsx'
import { InputField } from '@/components/input-field/input-field.tsx'
import { RadioField } from '@/components/input-field/radio-field.tsx'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Calendar } from '@/components/ui/calendar.tsx'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.tsx'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import i18next from '@/i18n.ts'
import { cn } from '@/lib/utils.ts'
import { FilesUploadForm } from '@/pages/tasklist/components/files-upload-form.tsx'
import { placeholderQuery } from '@/pages/tasklist/constants.ts'
import { useGetFacilitiesQuery } from '@/redux/api/facility.ts'
import { useUpdateOrderMutation } from '@/redux/api/orders.ts'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations.ts'
import { useGetAllPriorityQuery } from '@/redux/api/priority.ts'
import { OrderInterface, OrderUpdateInterface } from '@/types/interface/orders'
import { formatDate } from '@/utils/helpers.ts'

interface EditTaskFormProps {
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
    task: OrderInterface
}

const baseFieldsSchema = z.object({
    taskName: z
        .string()
        .min(1, { message: i18next.t('validation.require.title') }),
    taskDescription: z
        .string()
        .min(1, { message: i18next.t('validation.require.description') }),
    facility: z.string().optional(),
    executor: z
        .string()
        .min(1, { message: i18next.t('validation.require.task.executor') }),
    priority: z.string(),
})

const datesSchema = z
    .object({
        startDate: z.date({
            required_error: i18next.t('validation.require.start.date'),
        }),
        endDate: z.date({
            required_error: i18next.t('validation.require.end.date'),
        }),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: i18next.t('validation.require.dates.mismatch'),
        path: ['endDate'],
    })

const formSchema = z.intersection(baseFieldsSchema, datesSchema)

export const EditTaskForm = ({ task, setDialogOpen }: EditTaskFormProps) => {
    const { t } = useTranslation()
    const form = useForm({
        schema: formSchema,
        defaultValues: {
            taskName: task.order_name || '',
            taskDescription: task.order_description || '',
            facility: String(task.facility.facility_id),
            executor:
                task.executor.organization_id !== null
                    ? String(task.executor.organization_id)
                    : undefined,
            priority: String(task.priority.priority_id),
            startDate:
                task.planned_datetime && task.planned_datetime !== null
                    ? parseISO(task.planned_datetime)
                    : undefined,
            endDate:
                task.task_end_datetime && task.task_end_datetime !== null
                    ? parseISO(task.task_end_datetime)
                    : undefined,
        },
    })
    const taskType = useMemo(
        () => (task?.task?.task_id === null ? 'unplanned' : 'planned'),
        [task]
    )

    const [
        updateOrder,
        {
            isLoading: isOrderUpdating,
            error: updateOrderError,
            isSuccess: updateOrderSuccess,
        },
    ] = useUpdateOrderMutation()

    const {
        data: facilities = [],
        isLoading: facilitiesLoading,
        isError: facilitiesError,
        isSuccess: facilitiesSuccess,
    } = useGetFacilitiesQuery(placeholderQuery)

    const {
        data: organizations = [],
        isLoading: organizationsLoading,
        isError: organizationsError,
        isSuccess: organizationsSuccess,
    } = useGetAllOrganizationsQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    const {
        data: priorities = [],
        isLoading: prioritiesLoading,
        isError: prioritiesError,
        isSuccess: prioritiesSuccess,
    } = useGetAllPriorityQuery()

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        const updatedOrderData: OrderUpdateInterface = {
            order_id: task.order_id,
            task_id: task.task.task_id,
            order_name: data.taskName,
            order_description: data.taskDescription,
            facility_id: Number(data.facility),
            executor_id: Number(data.executor),
            planned_datetime: data.startDate.toISOString(),
            task_end_datetime: data.endDate.toISOString(),
            priority_id: Number(data.priority),
            property_values: [],
        }

        updateOrder(updatedOrderData)
    }

    const updateSuccessMsg = useMemo(
        () =>
            t('toast.success.description.update.f', {
                entityType: t('order'),
            }),
        []
    )

    useSuccessToast(updateSuccessMsg, updateOrderSuccess, setDialogOpen)
    useErrorToast(void 0, updateOrderError)

    return (
        <Tabs defaultValue="task" className="w-full h-full">
            <TabsList className="gap-2">
                <TabsTrigger
                    value="task"
                    className="data-[state=active]:text-primary uppercase"
                >
                    {t('order')}
                </TabsTrigger>
                <TabsTrigger
                    value="files"
                    className="data-[state=active]:text-primary uppercase"
                >
                    {t('files')}
                </TabsTrigger>
            </TabsList>
            <Separator className="w-full bg-[#E8E9EB]" decorative />
            <TabsContent value="task" className="w-full">
                <ScrollArea className="w-full h-[691px] pr-3">
                    <CustomForm form={form} onSubmit={handleSubmit}>
                        <RadioField
                            selectedValue={taskType}
                            value={taskType}
                            label={t(`task.${taskType}`)}
                            onChange={() => void 0}
                        />
                        <FormField
                            control={form.control}
                            name="taskName"
                            render={({ field }) => (
                                <InputField
                                    label={t('task.title')}
                                    className="mt-3"
                                    {...field}
                                    disabled={
                                        isOrderUpdating ||
                                        task.order_status.order_status_id === 9
                                    }
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskDescription"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>
                                        {t('task.description')}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('task.description')}
                                            {...field}
                                            disabled={
                                                isOrderUpdating ||
                                                task.order_status
                                                    .order_status_id === 9
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <InputField
                            label={t('branch')}
                            className="mt-3"
                            value={task.facility.checkpoint.branch.branch_name}
                            disabled
                        />
                        {task.order_status.order_status_id !== 9 ? (
                            <FormField
                                control={form.control}
                                name="facility"
                                render={({ field }) => (
                                    <FormItem className="mt-3">
                                        <FormLabel>{t('facility')}</FormLabel>
                                        {facilitiesLoading && (
                                            <Skeleton className="h-10 w-[522px] rounded-xl" />
                                        )}
                                        {facilitiesError && (
                                            <CustomAlert
                                                message={t(
                                                    'multiselect.error.facility'
                                                )}
                                            />
                                        )}
                                        {facilitiesSuccess &&
                                            facilities?.length > 0 && (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={String(
                                                        field.value
                                                    )}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'multiselect.placeholder.facility'
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {facilities.map(
                                                            (facility) => (
                                                                <SelectItem
                                                                    key={
                                                                        facility.facility_id
                                                                    }
                                                                    value={String(
                                                                        facility.facility_id
                                                                    )}
                                                                >
                                                                    {
                                                                        facility.facility_name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <InputField
                                label={t('facility')}
                                className="mt-3"
                                value={task.facility.facility_name}
                                disabled
                            />
                        )}
                        <InputField
                            label={t('checkpoint')}
                            className="mt-3"
                            value={task.facility.checkpoint.checkpoint_name}
                            disabled
                        />
                        {task.order_status.order_status_id !== 9 ? (
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="mt-3">
                                        <FormLabel>{t('priority')}</FormLabel>
                                        {prioritiesLoading && (
                                            <Skeleton className="h-10 w-[522px] rounded-xl" />
                                        )}
                                        {prioritiesError && (
                                            <CustomAlert
                                                message={t(
                                                    'multiselect.error.priority'
                                                )}
                                            />
                                        )}
                                        {prioritiesSuccess &&
                                            priorities?.length > 0 && (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={String(
                                                        field.value
                                                    )}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'multiselect.placeholder.priority'
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {priorities.map(
                                                            (priority) => (
                                                                <SelectItem
                                                                    key={
                                                                        priority.priority_id
                                                                    }
                                                                    value={String(
                                                                        priority.priority_id
                                                                    )}
                                                                >
                                                                    {
                                                                        priority.priority_name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <InputField
                                label={t('priority')}
                                className="mt-3"
                                value={task.priority.priority_name}
                                disabled
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="executor"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>{t('executor')}</FormLabel>
                                    {organizationsLoading && (
                                        <Skeleton className="h-10 w-[522px] rounded-xl" />
                                    )}
                                    {organizationsError && (
                                        <CustomAlert
                                            message={t(
                                                'multiselect.error.organization'
                                            )}
                                        />
                                    )}
                                    {organizationsSuccess &&
                                        organizations?.length > 0 && (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={String(
                                                    field.value
                                                )}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'multiselect.placeholder.executor'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {organizations.map(
                                                        (organization) => (
                                                            <SelectItem
                                                                key={
                                                                    organization.organization_id
                                                                }
                                                                value={String(
                                                                    organization.organization_id
                                                                )}
                                                            >
                                                                {
                                                                    organization.short_name
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className="mt-3 text-[#8A9099] text-sm font-medium">
                            {t('delivery.planned.date')}
                        </p>
                        <div className="flex mt-4 gap-9">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-[240px] pl-3 text-left font-normal rounded-xl gap-2.5 justify-start',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon />
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value
                                                            )
                                                        ) : (
                                                            <span>
                                                                {t(
                                                                    'multiselect.placeholder.start.date'
                                                                )}
                                                            </span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date <
                                                        new Date('1900-01-01')
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-[240px] pl-3 text-left font-normal rounded-xl gap-2.5 justify-start',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon />
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value
                                                            )
                                                        ) : (
                                                            <span>
                                                                {t(
                                                                    'multiselect.placeholder.end.date'
                                                                )}
                                                            </span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date <
                                                        new Date('1900-01-01')
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormMessage />
                        <Button
                            className="mt-10 mr-4 rounded-xl w-[120px]"
                            type="submit"
                            disabled={isOrderUpdating}
                        >
                            {isOrderUpdating ? (
                                <LoadingSpinner />
                            ) : (
                                t('button.action.change')
                            )}
                        </Button>
                    </CustomForm>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="files" className="h-[668px] mt-0">
                <FilesUploadForm
                    orderIDs={[task.order_id]}
                    setDialogOpen={setDialogOpen}
                />
            </TabsContent>
        </Tabs>
    )
}
