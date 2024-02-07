import { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import { useGetAllPriorityQuery } from '@/redux/api/priority'
import { formatDate } from '@/utils/helpers'

const baseSchema = z.object({
    taskName: z.string().min(1, { message: 'Небходимо добавить название' }),
    taskDescription: z
        .string()
        .min(5, { message: 'Небходимо добавить описание' }),
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
}

const placeholderQuery = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error 123
const AddTaskForm = ({ setDialogOpen }: AddTaskFormProps) => {
    const form = useForm({
        schema: formSchema,
        defaultValues: {
            taskName: '',
            taskDescription: '',
            branchesList: [],
            checkpointsList: [],
            priority: '',
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

    const {
        data: checkpoints = [],
        isLoading: checkpointsLoading,
        isError: checkpointsError,
        isSuccess: checkpointsSuccess,
    } = useGetCheckpointsQuery(placeholderQuery)
    const mappedCheckpoints: Option[] = checkpoints?.map((checkpoint) => ({
        label: checkpoint.checkpoint_name,
        value: checkpoint.checkpoint_id,
    }))

    const {
        data: priorities = [],
        isLoading: prioritiesLoading,
        isError: prioritiessError,
        isSuccess: prioritiesSuccess,
    } = useGetAllPriorityQuery(placeholderQuery)

    function handleSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                    <InputField
                        label="Название задачи"
                        {...field}
                        // disabled={isAdding}
                    />
                )}
            />
            <FormField
                control={form.control}
                name="taskDescription"
                render={({ field }) => (
                    <FormItem className="mt-7">
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
                        {branchesSuccess && branches?.length > 0 && (
                            <FormControl>
                                <MultiSelect
                                    onChange={(values) => {
                                        field.onChange(
                                            values.map(({ value }) => value)
                                        )
                                    }}
                                    options={mappedBranches}
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
                        {checkpointsSuccess && checkpoints?.length > 0 && (
                            <FormControl>
                                <MultiSelect
                                    onChange={(values) => {
                                        field.onChange(
                                            values.map(({ value }) => value)
                                        )
                                    }}
                                    options={mappedCheckpoints}
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
                name="priority"
                render={({ field }) => (
                    <FormItem className="mt-3">
                        <FormLabel>Приоритет</FormLabel>
                        {prioritiesLoading && <LoadingSpinner />}
                        {prioritiessError && (
                            <CustomAlert message="Приоритеты не загрузились. Попробуйте позднее." />
                        )}
                        {prioritiesSuccess && priorities?.length > 0 && (
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Установите приоритет" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {priorities.map((priority) => (
                                        <SelectItem
                                            key={priority.priority_id}
                                            value={String(priority.priority_id)}
                                        >
                                            {priority.priority_name}
                                        </SelectItem>
                                    ))}
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
                                                formatDate(field.value)
                                            ) : (
                                                <span>
                                                    Выберите дату начала
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
                                            date > new Date() ||
                                            date < new Date('1900-01-01')
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
                                                formatDate(field.value)
                                            ) : (
                                                <span>
                                                    Выберите дату окончания
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
                                            date > new Date() ||
                                            date < new Date('1900-01-01')
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
                className="mt-10 mr-4"
                type="submit"
                // disabled={isAdding}
            >
                Создать
            </Button>
        </CustomForm>
    )
}

export default AddTaskForm
