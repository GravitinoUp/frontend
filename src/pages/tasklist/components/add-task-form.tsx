import {
    Dispatch,
    lazy,
    SetStateAction,
    Suspense,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18next from '../../../i18n.ts'
import { placeholderQuery } from '../constants.ts'
import ArrowRight from '@/assets/icons/arrow_right.svg'
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
import { MultiSelect, Option } from '@/components/ui/multi-select.tsx'
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
import { cn } from '@/lib/utils.ts'
import { useGetBranchesQuery } from '@/redux/api/branch.ts'
import { useGetCategoriesQuery } from '@/redux/api/categories.ts'
import { useGetCheckpointsByBranchQuery } from '@/redux/api/checkpoints.ts'
import { useGetFacilitiesQuery } from '@/redux/api/facility.ts'
import { useAddOrderMutation, useAddTaskMutation } from '@/redux/api/orders.ts'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations.ts'
import { useGetAllPeriodicityQuery } from '@/redux/api/periodicity.ts'
import { useGetAllPriorityQuery } from '@/redux/api/priority.ts'
import {
    NewOrderBodyInterface,
    NewTaskBodyInterface,
    OrderInterface,
} from '@/types/interface/orders'
import { formatDate } from '@/utils/helpers.ts'

const FilesUploadForm = lazy(
    () => import('@/pages/tasklist/components/files-upload-form.tsx')
)

const baseSchema = z
    .object({
        taskName: z
            .string()
            .min(1, { message: i18next.t('validation.require.title') }),
        taskDescription: z
            .string()
            .min(5, { message: i18next.t('validation.require.description') }),
        facilities: z
            .array(z.number())
            .refine((value) => value.some((item) => item), {
                message: i18next.t('validation.require.select'),
            }),
        organizations: z
            .array(z.number())
            .refine((value) => value.some((item) => item), {
                message: i18next.t('validation.require.select'),
            }),
        branchesList: z
            .array(z.number())
            .refine((value) => value.some((item) => item), {
                message: i18next.t('validation.require.select'),
            }),
        checkpointsList: z.array(z.number()),
        priority: z
            .string()
            .min(1, i18next.t('validation.require.task.priority')),
        periodicity: z.string().optional(),
        category: z.string().optional(),
        taskType: z.enum(['planned', 'unplanned'], {
            required_error: i18next.t('validation.require.task.type'),
        }),
    })
    .superRefine((values, ctx) => {
        if (values.taskType === 'planned') {
            if (!values.periodicity) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['periodicity'],
                    fatal: true,
                    message: i18next.t('validation.require.task.periodicity'),
                })
            }

            if (!values.category) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['category'],
                    fatal: true,
                    message: i18next.t('validation.require.task.category'),
                })
            }
        }
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

const formSchema = z.intersection(baseSchema, datesSchema)

interface AddTaskFormProps {
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
    task?: OrderInterface
}

const AddTaskForm = ({ setDialogOpen, task }: AddTaskFormProps) => {
    const form = useForm({
        schema: formSchema,
        defaultValues: {
            taskName: '',
            taskDescription: '',
            facilities: [],
            branchesList: [],
            checkpointsList: [],
            priority: '',
            periodicity: '',
            category: '',
            taskType: 'planned',
        },
    })

    const {
        data: branches = [],
        isLoading: branchesLoading,
        isError: branchesError,
        isSuccess: branchesSuccess,
    } = useGetBranchesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })
    const mappedBranches: Option[] = branches?.map((branch) => ({
        label: branch.branch_name,
        value: branch.branch_id,
    }))
    const selectedBranches = form.watch('branchesList')

    const {
        data: checkpoints = [],
        isLoading: checkpointsLoading,
        isError: checkpointsError,
    } = useGetCheckpointsByBranchQuery(
        { body: placeholderQuery, branchIDS: selectedBranches },
        { skip: selectedBranches.length === 0 }
    )
    const mappedCheckpoints: Option[] = checkpoints?.map((checkpoint) => ({
        label: checkpoint.checkpoint_name,
        value: checkpoint.checkpoint_id,
    }))

    const {
        data: facilities = [],
        isLoading: facilitiesLoading,
        isError: facilitiesError,
        isSuccess: facilitiesSuccess,
    } = useGetFacilitiesQuery(placeholderQuery)
    const mappedFacilities: Option[] = facilities?.map((facility) => ({
        label: facility.facility_name,
        value: facility.facility_id,
    }))

    const {
        data: organizations = [],
        isLoading: organizationsLoading,
        isError: organizationsError,
        isSuccess: organizationsSuccess,
    } = useGetAllOrganizationsQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })
    const mappedOrganizations: Option[] = organizations?.map(
        (organization) => ({
            label: organization.short_name,
            value: organization.organization_id,
        })
    )

    const {
        data: priorities = [],
        isLoading: prioritiesLoading,
        isError: prioritiesError,
        isSuccess: prioritiesSuccess,
    } = useGetAllPriorityQuery()

    const isPlannedTask = form.watch('taskType') === 'planned'
    const {
        data: periodicity = [],
        isLoading: periodicityLoading,
        isError: periodicityError,
        isSuccess: periodicitySuccess,
    } = useGetAllPeriodicityQuery(void 0, { skip: !isPlannedTask })

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesError,
        isSuccess: categoriesSuccess,
    } = useGetCategoriesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
        skip: !isPlannedTask,
    })

    // создание внеплановой задачи
    const [
        addOrder,
        {
            data: newOrder,
            isLoading: isOrderAdding,
            error: addOrderError,
            isSuccess: addOrderSuccess,
        },
    ] = useAddOrderMutation()

    const newOrdersIDS = newOrder?.map((el) => el.order_id)

    // создание плановой задачи
    const [
        addTask,
        {
            data: newTask,
            isLoading: isTaskAdding,
            error: addTaskError,
            isSuccess: addTaskSuccess,
        },
    ] = useAddTaskMutation()

    const newTaskIDS = newTask?.map((el) => el.order_id)

    function handleSubmit(data: z.infer<typeof formSchema>) {
        if (data.taskType === 'unplanned') {
            const newOrderData: NewOrderBodyInterface = {
                order_name: data.taskName,
                order_description: data.taskDescription,
                branch_ids: data.branchesList,
                checkpoint_ids: data.checkpointsList,
                facility_ids: data.facilities,
                executor_ids: data.organizations,
                planned_datetime: data.startDate.toISOString(),
                task_end_datetime: data.endDate.toISOString(),
                priority_id: Number(data.priority),
                property_values: [],
            }

            addOrder(newOrderData)
        }

        if (data.taskType === 'planned') {
            const newTaskData: NewTaskBodyInterface = {
                task_name: data.taskName,
                task_description: data.taskDescription,
                category_id: Number(data.category),
                periodicity_id: Number(data.periodicity),
                branch_ids: data.branchesList,
                checkpoint_ids: data.checkpointsList,
                facility_ids: data.facilities,
                executor_ids: data.organizations,
                priority_id: Number(data.priority),
                period_start: data.startDate.toISOString(),
                period_end: data.endDate.toISOString(),
            }

            addTask(newTaskData)
        }
    }

    const [activeTab, setActiveTab] = useState('task')
    const { t } = useTranslation()
    const addSuccessMsg = useMemo(
        () =>
            t('toast.success.description.create.f', {
                entityType: t('order'),
            }),
        []
    )

    useEffect(() => {
        if (addTaskSuccess || addOrderSuccess) {
            setActiveTab('files')
        }
    }, [addTaskSuccess, addOrderSuccess])

    useSuccessToast(addSuccessMsg, addOrderSuccess || addTaskSuccess)
    useErrorToast(void 0, addTaskError)
    useErrorToast(void 0, addOrderError)

    return (
        <Tabs
            value={activeTab}
            onValueChange={task && setActiveTab}
            className="w-full h-full"
        >
            <TabsList className="gap-2">
                <TabsTrigger
                    value="task"
                    className="data-[state=active]:text-primary uppercase"
                >
                    {t('order')}
                </TabsTrigger>
                <span className="pb-4">
                    <ArrowRight />
                </span>
                <TabsTrigger
                    value="files"
                    className="data-[state=active]:text-primary uppercase"
                >
                    {t('files')}
                </TabsTrigger>
            </TabsList>
            <Separator className="w-full bg-[#E8E9EB]" decorative />
            <TabsContent value="task" className="w-full">
                <ScrollArea className="w-full h-[690px] pr-10">
                    <CustomForm form={form} onSubmit={handleSubmit}>
                        <FormField
                            control={form.control}
                            name="taskType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('task.type')}</FormLabel>
                                    <div className="flex gap-2.5">
                                        <FormControl>
                                            <RadioField
                                                selectedValue={field.value}
                                                value="planned"
                                                label={t('task.planned')}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <RadioField
                                                selectedValue={field.value}
                                                value="unplanned"
                                                label={t('task.unplanned')}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isPlannedTask && (
                            <FormField
                                control={form.control}
                                name="periodicity"
                                render={({ field }) => (
                                    <FormItem className="mt-5">
                                        {periodicityLoading && (
                                            <Skeleton className="h-10 w-[522px] rounded-xl" />
                                        )}
                                        {periodicityError && (
                                            <CustomAlert
                                                message={t(
                                                    'multiselect.error.periodicity'
                                                )}
                                            />
                                        )}
                                        {periodicitySuccess &&
                                            periodicity?.length > 0 && (
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
                                                                    'multiselect.placeholder.periodicity'
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {periodicity.map(
                                                            (period) => (
                                                                <SelectItem
                                                                    key={
                                                                        period.periodicity_id
                                                                    }
                                                                    value={String(
                                                                        period.periodicity_id
                                                                    )}
                                                                >
                                                                    {
                                                                        period.periodicity_name
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
                        )}
                        <FormField
                            control={form.control}
                            name="taskName"
                            render={({ field }) => (
                                <InputField
                                    label={t('task.title')}
                                    className="mt-3"
                                    {...field}
                                    disabled={isOrderAdding || isTaskAdding}
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="branchesList"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>{t('branch')}</FormLabel>
                                    {branchesLoading && (
                                        <Skeleton className="h-10 w-[522px] rounded-xl" />
                                    )}
                                    {branchesError && (
                                        <CustomAlert
                                            message={t(
                                                'multiselect.error.branch'
                                            )}
                                        />
                                    )}
                                    {branchesSuccess &&
                                        branches?.length > 0 && (
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value
                                                            )
                                                        )
                                                    }}
                                                    options={mappedBranches}
                                                    placeholder={t(
                                                        'multiselect.placeholder.branch'
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="facilities"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>{t('facilities')}</FormLabel>
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
                                        facilities.length > 0 && (
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value
                                                            )
                                                        )
                                                    }}
                                                    options={mappedFacilities}
                                                    placeholder={t(
                                                        'multiselect.placeholder.facility'
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="checkpointsList"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>{t('checkpoint')}</FormLabel>
                                    {checkpointsLoading && (
                                        <Skeleton className="h-10 w-[522px] rounded-xl" />
                                    )}
                                    {checkpointsError && (
                                        <CustomAlert
                                            message={t(
                                                'multiselect.error.checkpoint'
                                            )}
                                        />
                                    )}
                                    {!checkpointsError &&
                                        !checkpointsLoading && (
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value
                                                            )
                                                        )
                                                    }}
                                                    options={mappedCheckpoints}
                                                    disabled={
                                                        selectedBranches.length ===
                                                        0
                                                    }
                                                    placeholder={t(
                                                        'multiselect.placeholder.checkpoint'
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="organizations"
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
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value
                                                            )
                                                        )
                                                    }}
                                                    options={
                                                        mappedOrganizations
                                                    }
                                                    placeholder={t(
                                                        'multiselect.placeholder.executor'
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                                onValueChange={field.onChange}
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
                        {isPlannedTask && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="mt-3">
                                            <FormLabel>
                                                {t('category')}
                                            </FormLabel>
                                            {categoriesLoading && (
                                                <Skeleton className="h-10 w-[522px] rounded-xl" />
                                            )}
                                            {categoriesError && (
                                                <CustomAlert
                                                    message={t(
                                                        'multiselect.error.category'
                                                    )}
                                                />
                                            )}
                                            {categoriesSuccess &&
                                                categories?.length > 0 && (
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
                                                                        'multiselect.placeholder.category'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.category_id
                                                                        }
                                                                        value={String(
                                                                            category.category_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            category.category_name
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
                            </>
                        )}
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
                            disabled={isOrderAdding || isTaskAdding}
                        >
                            {isOrderAdding || isTaskAdding ? (
                                <LoadingSpinner />
                            ) : task ? (
                                t('button.action.change')
                            ) : (
                                t('button.action.next')
                            )}
                        </Button>
                    </CustomForm>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="files" className="h-[668px] mt-0">
                {(addOrderSuccess || addTaskSuccess) && (
                    <Suspense
                        fallback={
                            <LoadingSpinner className="w-16 h-16 text-primary" />
                        }
                    >
                        <FilesUploadForm
                            orderIDs={newOrdersIDS || newTaskIDS}
                            setDialogOpen={setDialogOpen}
                        />
                    </Suspense>
                )}
            </TabsContent>
        </Tabs>
    )
}

export default AddTaskForm
