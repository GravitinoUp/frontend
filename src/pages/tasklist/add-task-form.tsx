import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { NewOrderBodyInterface, NewTaskBodyInterface, placeholderQuery } from './constants'
import i18next from '../../i18n.ts'
import CalendarIcon from '@/assets/icons/Calendar.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import { FileData, MultiFileInput } from '@/components/file-container/multi-file-input.tsx'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { RadioField } from '@/components/input-field/radio-field.tsx'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MultiSelect, Option } from '@/components/ui/multi-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { cn } from '@/lib/utils'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { useGetCategoriesQuery } from '@/redux/api/categories.ts'
import { useGetCheckpointsByBranchQuery } from '@/redux/api/checkpoints'
import { useGetFacilitiesByBranchQuery } from '@/redux/api/facility'
import { useAddOrderMutation, useAddTaskMutation } from '@/redux/api/orders'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
import { useGetAllPeriodicityQuery } from '@/redux/api/periodicity.ts'
import { useGetAllPriorityQuery } from '@/redux/api/priority'
import { OrderInterface } from '@/types/interface/orders'
import { formatDate } from '@/utils/helpers'

const baseSchema = z.object({
    taskName: z.string().min(1, { message: i18next.t('validation.require.title') }),
    taskDescription: z.string().min(5, { message: i18next.t('validation.require.description') }),
    facilities: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: i18next.t('validation.require.select'),
    }),
    organizations: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: i18next.t('validation.require.select'),
    }),
    branchesList: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: i18next.t('validation.require.select'),
    }),
    checkpointsList: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: i18next.t('validation.require.select'),
    }),
    priority: z.string({ required_error: i18next.t('validation.require.task.priority') }),
    periodicity: z.string({ required_error: i18next.t('validation.require.task.periodicity') }),
    category: z.string({ required_error: i18next.t('validation.require.task.category') }),
    taskType: z.string({ required_error: i18next.t('validation.require.task.type') }),
})

const datesSchema = z.object({
    startDate: z.date({
        required_error: i18next.t('validation.require.start.date'),
    }),
    endDate: z.date({
        required_error: i18next.t('validation.require.end.date'),
    }),
}).refine((data) => data.endDate > data.startDate, {
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
            priority: task ? String(task.priority.priority_id) : '',
            periodicity: task ? String(task.task.periodicity?.periodicity_id) : '',
            category: task ? String(task.task.category.category_id) : '',
            taskType: task ? (task.task.task_id === null ? 'unplanned' : 'planned') : 'unplanned',
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
        { skip: selectedBranches.length === 0 },
    )
    const mappedCheckpoints: Option[] = checkpoints?.map((checkpoint) => ({
        label: checkpoint.checkpoint_name,
        value: checkpoint.checkpoint_id,
    }))

    const {
        data: facilities = [],
        isLoading: facilitiesLoading,
        isError: facilitiesError,
    } = useGetFacilitiesByBranchQuery(
        { body: placeholderQuery, branchIDS: selectedBranches },
        { skip: selectedBranches.length === 0 },
    )
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
        }),
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
    } = useGetCategoriesQuery(placeholderQuery,
        { selectFromResult: (result) => ({ ...result, data: result.data?.data }), skip: !isPlannedTask })
    console.log(categories, periodicity)
    // создание внеплановой задачи
    const [
        addOrder,
        { isLoading: isOrderAdding, isError: addOrderError, isSuccess: addOrderSuccess },
    ] = useAddOrderMutation()

    // создание плановой задачи
    const [addTask, {
        isLoading: isTaskAdding,
        isError: addTaskError,
        isSuccess: addTaskSuccess,
    }] = useAddTaskMutation()

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
    const addSuccessMsg = useMemo(() => t('toast.success.description.create.m', {
        entityType: t('order'),
    }), [])

    useSuccessToast(addSuccessMsg, addOrderSuccess || addTaskSuccess, setDialogOpen)

    const [selectedFiles, setSelectedFiles] = useState<FileData[]>([])
    const handleFileUpload = () => {

    }

    const handleFileDelete = (id: string) => {
        const result = selectedFiles.filter((data) => data.id !== id)
        setSelectedFiles(result)
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="overflow-auto  w-full h-full">
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
                        <FormField
                            control={form.control}
                            name="taskType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('task.type')}</FormLabel>
                                    <div className="flex gap-2.5">
                                        <FormControl>
                                            <RadioField selectedValue={field.value} value="planned"
                                                        label={t('task.planned')} onChange={field.onChange} />
                                        </FormControl>
                                        <FormControl>
                                            <RadioField selectedValue={field.value} value="unplanned"
                                                        label={t('task.unplanned')} onChange={field.onChange} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    <FormLabel>{t('task.description')}</FormLabel>
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
                                    {branchesLoading && <LoadingSpinner />}
                                    {branchesError && (
                                        <CustomAlert message={t('multiselect.error.branch')} />
                                    )}
                                    {branchesSuccess &&
                                        branches?.length > 0 && (
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value,
                                                            ),
                                                        )
                                                    }}
                                                    options={mappedBranches}
                                                    defaultOptions={
                                                        task && [
                                                            {
                                                                value: task?.facility.checkpoint.branch.branch_id,
                                                                label: task?.facility.checkpoint.branch.branch_name,
                                                            },
                                                        ]
                                                    }
                                                    placeholder={t('multiselect.placeholder.branch')}
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
                                    {facilitiesLoading && <LoadingSpinner />}
                                    {facilitiesError && (
                                        <CustomAlert message={t('multiselect.error.facility')} />
                                    )}
                                    {!facilitiesError && !facilitiesLoading && (
                                        <FormControl>
                                            <MultiSelect
                                                onChange={(values) => {
                                                    field.onChange(
                                                        values.map(
                                                            ({ value }) => value,
                                                        ),
                                                    )
                                                }}
                                                options={mappedFacilities}
                                                defaultOptions={
                                                    task && [
                                                        {
                                                            value: task?.facility.facility_id,
                                                            label: task?.facility.facility_name,
                                                        },
                                                    ]
                                                }
                                                disabled={
                                                    selectedBranches.length ===
                                                    0
                                                }
                                                placeholder={t('multiselect.placeholder.facility')}
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
                                    {checkpointsLoading && <LoadingSpinner />}
                                    {checkpointsError && (
                                        <CustomAlert message={t('multiselect.error.checkpoint')} />
                                    )}
                                    {!checkpointsError &&
                                        !checkpointsLoading && (
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value,
                                                            ),
                                                        )
                                                    }}
                                                    options={mappedCheckpoints}
                                                    defaultOptions={
                                                        task && [
                                                            {
                                                                value: task?.facility.checkpoint.checkpoint_id,
                                                                label: task?.facility.checkpoint.checkpoint_name,
                                                            },
                                                        ]
                                                    }
                                                    disabled={
                                                        selectedBranches.length ===
                                                        0
                                                    }
                                                    placeholder={t('multiselect.placeholder.checkpoint')}
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
                                    {organizationsLoading && <LoadingSpinner />}
                                    {organizationsError && (
                                        <CustomAlert message={t('multiselect.error.organization')} />
                                    )}
                                    {organizationsSuccess &&
                                        organizations?.length > 0 && (
                                            <FormControl>
                                                <MultiSelect
                                                    onChange={(values) => {
                                                        field.onChange(
                                                            values.map(
                                                                ({ value }) =>
                                                                    value,
                                                            ),
                                                        )
                                                    }}
                                                    options={
                                                        mappedOrganizations
                                                    }
                                                    defaultOptions={
                                                        task && [
                                                            {
                                                                value: task?.executor.organization_id,
                                                                label: task?.executor.short_name,
                                                            },
                                                        ]
                                                    }
                                                    placeholder={t('multiselect.placeholder.executor')}
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
                                    {prioritiesLoading && <LoadingSpinner />}
                                    {prioritiesError && (
                                        <CustomAlert message={t('multiselect.error.priority')} />
                                    )}
                                    {prioritiesSuccess &&
                                        priorities?.length > 0 && (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t('multiselect.placeholder.priority')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {priorities.map(
                                                        (priority) => (
                                                            <SelectItem
                                                                key={priority.priority_id}
                                                                value={String(priority.priority_id)}
                                                            >
                                                                {priority.priority_name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            isPlannedTask &&
                            <FormField
                                control={form.control}
                                name="periodicity"
                                render={({ field }) => (
                                    <FormItem className="mt-3">
                                        <FormLabel>{t('periodicity')}</FormLabel>
                                        {periodicityLoading && <LoadingSpinner />}
                                        {periodicityError && (
                                            <CustomAlert message={t('multiselect.error.periodicity')} />
                                        )}
                                        {periodicitySuccess &&
                                            periodicity?.length > 0 && (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={String(field.value)}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder={t(
                                                                    'multiselect.placeholder.periodicity')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {periodicity.map(
                                                            (period) => (
                                                                <SelectItem
                                                                    key={period.periodicity_id}
                                                                    value={String(period.periodicity_id)}
                                                                >
                                                                    {period.periodicity_name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        {
                            isPlannedTask &&
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="mt-3">
                                        <FormLabel>{t('category')}</FormLabel>
                                        {categoriesLoading && <LoadingSpinner />}
                                        {categoriesError && (
                                            <CustomAlert message={t('multiselect.error.category')} />
                                        )}
                                        {categoriesSuccess &&
                                            categories?.length > 0 && (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={String(field.value)}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t(
                                                                'multiselect.placeholder.category')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={category.category_id}
                                                                    value={String(category.category_id)}
                                                                >
                                                                    {category.category_name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
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
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[240px] pl-3 text-left font-normal rounded-xl gap-2.5 justify-start',
                                                            !field.value &&
                                                            'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon />
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value,
                                                            )
                                                        ) : (
                                                            <span>
                                                                {t('multiselect.placeholder.start.date')}
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
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[240px] pl-3 text-left font-normal rounded-xl gap-2.5 justify-start',
                                                            !field.value &&
                                                            'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon />
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value,
                                                            )
                                                        ) : (
                                                            <span>
                                                                {t('multiselect.placeholder.end.date')}
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
                        {addOrderError || addTaskError && <CustomAlert className="mt-3" />}
                        <Button
                            className="mt-10 mr-4 rounded-xl w-[120px]"
                            type="submit"
                            disabled={isOrderAdding || isTaskAdding}
                        >
                            {isOrderAdding || isTaskAdding ? <LoadingSpinner /> : t('button.action.create')}
                        </Button>
                    </CustomForm>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="files">
                <ScrollArea className="w-full h-[691px] pr-3">
                    <MultiFileInput setSelectedFiles={setSelectedFiles} />
                    <div className="flex flex-col gap-16 mt-16">
                        <div className="flex flex-col gap-3">
                            {selectedFiles.length > 0 && selectedFiles.map(({ id, filename, fileimage }) => (
                                <div key={id}
                                     className="h-[90px] border rounded-xl flex justify-between items-center px-8">
                                    <div className="flex gap-2 items-center">
                                        <img src={fileimage} className="h-[72px] w-[72px] rounded-xl"
                                             alt="" />
                                        <p className="text-xs max-w-[400px] overflow-ellipsis overflow-hidden">{filename}</p>
                                    </div>
                                    <Button variant="ghost" onClick={() => handleFileDelete(id)}>
                                        <DeleteIcon />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" className="rounded-xl w-[120px]" onClick={handleFileUpload}>
                                {t('button.action.create')}
                            </Button>
                            <Button type="button" variant="outline" className="rounded-xl w-[120px]"
                                    onClick={() => {
                                        form.clearErrors()
                                        setActiveTab('task')
                                    }}>
                                {t('button.action.back')}
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    )
}

export default AddTaskForm
