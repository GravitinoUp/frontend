import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { NewOrderBodyInterface, placeholderQuery } from './constants'
import i18next from '../../i18n.ts'
import CalendarIcon from '@/assets/icons/Calendar.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MultiSelect, Option } from '@/components/ui/multi-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { cn } from '@/lib/utils'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { useGetCheckpointsByBranchQuery } from '@/redux/api/checkpoints'
import { useGetFacilitiesByCheckpointQuery } from '@/redux/api/facility'
import { useAddOrderMutation } from '@/redux/api/orders'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
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
    const selectedCheckpoints = form.watch('checkpointsList')

    const {
        data: facilities = [],
        isLoading: facilitiesLoading,
        isError: facilitiesError,
    } = useGetFacilitiesByCheckpointQuery(
        { body: placeholderQuery, checkpointIDS: selectedCheckpoints },
        { skip: selectedCheckpoints.length === 0 },
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

    const [
        addOrder,
        { isLoading: isAdding, isError: addError, isSuccess: addSuccess },
    ] = useAddOrderMutation()

    function handleSubmit(data: z.infer<typeof formSchema>) {
        const formattedData: NewOrderBodyInterface = {
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

        if (data.taskType === 'unplanned') {
            addOrder(formattedData)
        }
    }

    const { t } = useTranslation()

    const addSuccessMsg = useMemo(() => t('toast.success.description.create.m', {
        entityType: t('order'),
    }), [])

    useSuccessToast(addSuccessMsg, addSuccess, setDialogOpen)

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <Tabs defaultValue="task" className="overflow-auto  w-full h-full">
                <TabsList className="gap-2">
                    <TabsTrigger
                        value="task"
                        className="data-[state=active]:text-primary uppercase"
                    >
                        {t('order')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="files"
                        className="data-[state=active]:text-primary"
                    >
                        {t('files')}
                    </TabsTrigger>
                </TabsList>
                <Separator className="w-full bg-[#E8E9EB]" decorative />
                <TabsContent value="task" className="w-full">
                    <ScrollArea className="w-full h-[691px] pr-3">
                        <FormField
                            control={form.control}
                            name="taskType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('task.type')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="planned" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('task.planned')}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem
                                                className="flex items-center space-x-3 space-y-0"
                                                style={{ marginTop: '0px' }}
                                            >
                                                <FormControl>
                                                    <RadioGroupItem value="unplanned" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('task.unplanned')}
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
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
                                    disabled={isAdding}
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
                                                    selectedCheckpoints.length ===
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
                                                defaultValue={String(
                                                    field.value,
                                                )}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t(
                                                            'multiselect.placeholder.priority')} />
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
                                                                    priority.priority_id,
                                                                )}
                                                            >
                                                                {
                                                                    priority.priority_name
                                                                }
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
                        {addError && <CustomAlert className="mt-3" />}
                        <Button
                            className="mt-10 mr-4"
                            type="submit"
                            disabled={isAdding}
                        >
                            {isAdding ? <LoadingSpinner /> : t('button.action.create')}
                        </Button>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </CustomForm>
    )
}

export default AddTaskForm
