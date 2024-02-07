import { Dispatch, SetStateAction, useEffect } from 'react'
import { z } from 'zod'
import { placeholderQuery } from './constants'
import CalendarIcon from '@/assets/icons/Calendar.svg'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { MultiSelect, Option } from '@/components/ui/multi-select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
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
    taskName: z.string().min(1, { message: 'Небходимо добавить название' }),
    taskDescription: z
        .string()
        .min(5, { message: 'Небходимо добавить описание' }),
    facilities: z
        .array(z.number())
        .refine((value) => value.some((item) => item), {
            message: 'Надо выбрать хотя бы один элемент из списка',
        }),
    organizations: z
        .array(z.number())
        .refine((value) => value.some((item) => item), {
            message: 'Надо выбрать хотя бы один элемент из списка',
        }),
    branchesList: z
        .array(z.number())
        .refine((value) => value.some((item) => item), {
            message: 'Надо выбрать хотя бы один элемент из списка',
        }),
    checkpointsList: z
        .array(z.number())
        .refine((value) => value.some((item) => item), {
            message: 'Надо выбрать хотя бы один элемент из списка',
        }),
    priority: z.string({ required_error: 'Установите приоритет задачи' }),
    taskType: z.string({ required_error: 'Выберите тип задачи' }),
    startDate: z.date({
        required_error: 'Укажите дату начала',
    }),
    endDate: z.date({
        required_error: 'Укажите дату окончания',
    }),
})

const datesSchema = z
    .object({
        startDate: z.date({
            required_error: 'Укажите дату начала',
        }),
        endDate: z.date({
            required_error: 'Укажите дату окончания',
        }),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: 'Дата окончания должна быть больше даты начала',
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
    } = useGetBranchesQuery(placeholderQuery)
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
    const selectedCheckpoints = form.watch('checkpointsList')

    const {
        data: facilities = [],
        isLoading: facilitiesLoading,
        isError: facilitiesError,
    } = useGetFacilitiesByCheckpointQuery(
        { body: placeholderQuery, checkpointIDS: selectedCheckpoints },
        { skip: selectedCheckpoints.length === 0 }
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
    } = useGetAllOrganizationsQuery(placeholderQuery)
    const mappedOrganizations: Option[] = organizations?.map(
        (organization) => ({
            label: organization.short_name,
            value: organization.organization_id,
        })
    )

    const {
        data: priorities = [],
        isLoading: prioritiesLoading,
        isError: prioritiessError,
        isSuccess: prioritiesSuccess,
    } = useGetAllPriorityQuery()

    const [
        addOrder,
        { isLoading: isAdding, isError: addError, isSuccess: addSuccess },
    ] = useAddOrderMutation()

    function handleSubmit(data: z.infer<typeof formSchema>) {
        const formattedData = {
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

    const { toast } = useToast()

    useEffect(() => {
        if (addSuccess) {
            toast({
                description: `Задача успешно добавлена`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [addSuccess])

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <Tabs defaultValue="task" className="overflow-auto  w-full h-full">
                <TabsList className="gap-2">
                    <TabsTrigger
                        value="task"
                        className="data-[state=active]:text-primary"
                    >
                        ЗАДАЧА
                    </TabsTrigger>
                    <TabsTrigger
                        value="files"
                        className="data-[state=active]:text-primary"
                    >
                        ФАЙЛЫ
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
                                    <FormLabel>Тип задачи</FormLabel>
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
                                                    Плановая
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
                                                    Внеплановая
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
                                    label="Название задачи"
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
                                    <FormLabel>Описание задачи</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Добавьте описание"
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
                                    <FormLabel>Филиал</FormLabel>
                                    {branchesLoading && <LoadingSpinner />}
                                    {branchesError && (
                                        <CustomAlert message="Список филиалов не загрузился. Попробуйте позднее." />
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
                                                    defaultOptions={
                                                        task && [
                                                            {
                                                                value: task
                                                                    ?.facility
                                                                    .checkpoint
                                                                    .branch
                                                                    .branch_id,
                                                                label: task
                                                                    ?.facility
                                                                    .checkpoint
                                                                    .branch
                                                                    .branch_name,
                                                            },
                                                        ]
                                                    }
                                                    placeholder="Выберите филиал"
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
                                    <FormLabel>Пункт пропуска</FormLabel>
                                    {checkpointsLoading && <LoadingSpinner />}
                                    {checkpointsError && (
                                        <CustomAlert message="Список пунктов пропуска не загрузился. Попробуйте позднее." />
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
                                                    defaultOptions={
                                                        task && [
                                                            {
                                                                value: task
                                                                    ?.facility
                                                                    .checkpoint
                                                                    .checkpoint_id,
                                                                label: task
                                                                    ?.facility
                                                                    .checkpoint
                                                                    .checkpoint_name,
                                                            },
                                                        ]
                                                    }
                                                    disabled={
                                                        selectedBranches.length ===
                                                        0
                                                    }
                                                    placeholder="Выберите пункт пропуска"
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
                                    <FormLabel>Объекты обслуживания</FormLabel>
                                    {facilitiesLoading && <LoadingSpinner />}
                                    {facilitiesError && (
                                        <CustomAlert message="Список объектов обслуживания не загрузился. Попробуйте позднее." />
                                    )}
                                    {!facilitiesError && !facilitiesLoading && (
                                        <FormControl>
                                            <MultiSelect
                                                onChange={(values) => {
                                                    field.onChange(
                                                        values.map(
                                                            ({ value }) => value
                                                        )
                                                    )
                                                }}
                                                options={mappedFacilities}
                                                defaultOptions={
                                                    task && [
                                                        {
                                                            value: task
                                                                ?.facility
                                                                .facility_id,
                                                            label: task
                                                                ?.facility
                                                                .facility_name,
                                                        },
                                                    ]
                                                }
                                                disabled={
                                                    selectedCheckpoints.length ===
                                                    0
                                                }
                                                placeholder="Выберите объект обслуживания"
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
                                    <FormLabel>Исполнитель</FormLabel>
                                    {organizationsLoading && <LoadingSpinner />}
                                    {organizationsError && (
                                        <CustomAlert message="Список организаций не загрузился. Попробуйте позднее." />
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
                                                    defaultOptions={
                                                        task && [
                                                            {
                                                                value: task
                                                                    ?.executor
                                                                    .organization_id,
                                                                label: task
                                                                    ?.executor
                                                                    .short_name,
                                                            },
                                                        ]
                                                    }
                                                    placeholder="Выберите исполнителя"
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
                                    <FormLabel>Приоритет</FormLabel>
                                    {prioritiesLoading && <LoadingSpinner />}
                                    {prioritiessError && (
                                        <CustomAlert message="Приоритеты не загрузились. Попробуйте позднее." />
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
                                                        <SelectValue placeholder="Установите приоритет" />
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
                        <p className="mt-3 text-[#8A9099] text-sm font-medium">
                            Планируемая дата сдачи
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
                                                                Выберите дату
                                                                начала
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
                                                                Выберите дату
                                                                окончания
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
                            {isAdding ? <LoadingSpinner /> : 'Создать'}
                        </Button>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </CustomForm>
    )
}

export default AddTaskForm
