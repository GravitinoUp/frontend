import { Dispatch, Fragment, SetStateAction, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { initialColumnVisibility } from '../constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import FilterFormTitle from '@/components/form/filter-title'
import CustomForm, { useForm } from '@/components/form/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
    defaultQuery,
    TasksFilterQueryContext,
} from '@/context/tasks/tasks-filter-query.tsx'
import { useGetBranchesQuery } from '@/redux/api/branch'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
import { useGetAllPriorityQuery } from '@/redux/api/priority'

const tasksColumnsSchema = z.object({
    key: z.boolean().default(true).optional(),
    order_id: z.boolean().default(true).optional(),
    order_name: z.boolean().default(true).optional(),
    facility_name: z.boolean().default(true).optional(),
    checkpoint_name: z.boolean().default(true).optional(),
    branch_name: z.boolean().default(true).optional(),
    order_description: z.boolean().default(true).optional(),
    order_status_name: z.boolean().default(true).optional(),
    priority_name: z.boolean().default(true).optional(),
    executor: z.boolean().default(true).optional(),
    creator: z.boolean().default(true).optional(),
    deliveryDate: z.boolean().default(true).optional(),
    ended_at_datetime: z.boolean().default(true).optional(),
    taskType: z.boolean().default(true).optional(),
    periodicity: z.boolean().default(true).optional(),
})

export type TasksFilterColumns = z.infer<typeof tasksColumnsSchema>

const filterSchema = z.object({
    branch_id: z.number().optional(),
    checkpoint_id: z.number().optional(),
    organization_id: z.number().optional(),
    priority_id: z.number().optional(),
    columns: tasksColumnsSchema,
})

const placeholderQuery = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
}

interface TaskFiltersFormProps {
    filtersData: z.infer<typeof filterSchema>
    setFormOpen: Dispatch<SetStateAction<boolean>>
    setFilterColumns: Dispatch<SetStateAction<TasksFilterColumns>>
}

const TaskFiltersForm = ({
    filtersData,
    setFormOpen,
    setFilterColumns,
}: TaskFiltersFormProps) => {
    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(
        TasksFilterQueryContext
    )
    const form = useForm({
        schema: filterSchema,
        defaultValues: filtersData,
    })

    const {
        data: branches = [],
        isLoading: branchesLoading,
        isError: branchesError,
        isSuccess: branchesSuccess,
    } = useGetBranchesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    const {
        data: checkpoints = [],
        isLoading: checkpointsLoading,
        isError: checkpointsError,
        isSuccess: checkpointsSuccess,
    } = useGetCheckpointsQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

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

    const { t } = useTranslation()

    const handleSubmit = (data: z.infer<typeof filterSchema>) => {
        console.log(data)

        setPersonalOrdersQuery({
            ...personalOrdersQuery,
            offset: {
                ...personalOrdersQuery.offset,
                page: 1,
            },
            filter: {
                ...personalOrdersQuery.filter,
                facility:
                    (data.checkpoint_id && data.checkpoint_id !== 0) ||
                    (data.branch_id && data.branch_id !== 0)
                        ? {
                              checkpoint: {
                                  checkpoint_id:
                                      data.checkpoint_id &&
                                      data.checkpoint_id !== 0
                                          ? data.checkpoint_id
                                          : undefined,
                                  branch:
                                      data.branch_id && data.branch_id !== 0
                                          ? {
                                                branch_id: data.branch_id,
                                            }
                                          : undefined,
                              },
                          }
                        : undefined,
                executor:
                    data.organization_id && data.organization_id !== 0
                        ? {
                              organization_id: data.organization_id,
                          }
                        : undefined,
                priority:
                    data.priority_id && data.priority_id !== 0
                        ? {
                              priority_id: data.priority_id,
                          }
                        : undefined,
            },
        })
        setFilterColumns(data.columns)
        setFormOpen(false)
    }

    const handleFiltersReset = () => {
        form.reset({
            branch_id: 0,
            checkpoint_id: 0,
            organization_id: 0,
            priority_id: 0,
            columns: initialColumnVisibility,
        })
        setPersonalOrdersQuery({
            ...defaultQuery,
            filter: {
                order_status: personalOrdersQuery.filter.order_status,
            },
            period: personalOrdersQuery.period,
        })
        setFilterColumns(initialColumnVisibility)
    }

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <div className="flex gap-16 mt-12">
                <FormField
                    control={form.control}
                    name="branch_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('branch')} />
                            {branchesLoading && (
                                <Skeleton className="h-10 w-[213px] rounded-xl" />
                            )}
                            {branchesError && (
                                <CustomAlert
                                    message={t('multiselect.error.branch')}
                                />
                            )}
                            {branchesSuccess && branches?.length > 0 && (
                                <FormControl>
                                    <Select
                                        value={
                                            field.value && field.value !== 0
                                                ? String(field.value)
                                                : 'all'
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(
                                                value !== 'all'
                                                    ? Number(value)
                                                    : undefined
                                            )
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('all')}
                                            </SelectItem>
                                            {branches.map((branch) => (
                                                <SelectItem
                                                    key={branch.branch_id}
                                                    value={String(
                                                        branch.branch_id
                                                    )}
                                                >
                                                    {branch.branch_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="checkpoint_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('checkpoint')} />
                            {checkpointsLoading && (
                                <Skeleton className="h-10 w-[213px] rounded-xl" />
                            )}
                            {checkpointsError && (
                                <CustomAlert
                                    message={t('multiselect.error.checkpoint')}
                                />
                            )}
                            {checkpointsSuccess && checkpoints?.length > 0 && (
                                <FormControl>
                                    <Select
                                        value={
                                            field.value && field.value !== 0
                                                ? String(field.value)
                                                : 'all'
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(
                                                value !== 'all'
                                                    ? Number(value)
                                                    : undefined
                                            )
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('all')}
                                            </SelectItem>
                                            {checkpoints.map((checkpoint) => (
                                                <SelectItem
                                                    key={
                                                        checkpoint.checkpoint_id
                                                    }
                                                    value={String(
                                                        checkpoint.checkpoint_id
                                                    )}
                                                >
                                                    {checkpoint.checkpoint_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="organization_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('organization')} />
                            {organizationsLoading && (
                                <Skeleton className="h-10 w-[213px] rounded-xl" />
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
                                        <Select
                                            value={
                                                field.value && field.value !== 0
                                                    ? String(field.value)
                                                    : 'all'
                                            }
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value !== 'all'
                                                        ? Number(value)
                                                        : undefined
                                                )
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    {t('all')}
                                                </SelectItem>
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
                                    </FormControl>
                                )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('priority')} />
                            {prioritiesLoading && (
                                <Skeleton className="h-10 w-[213px] rounded-xl" />
                            )}
                            {prioritiesError && (
                                <CustomAlert
                                    message={t('multiselect.error.priority')}
                                />
                            )}
                            {prioritiesSuccess && priorities?.length > 0 && (
                                <FormControl>
                                    <Select
                                        value={
                                            field.value && field.value !== 0
                                                ? String(field.value)
                                                : 'all'
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(
                                                value !== 'all'
                                                    ? Number(value)
                                                    : undefined
                                            )
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('all')}
                                            </SelectItem>
                                            {priorities.map((priority) => (
                                                <SelectItem
                                                    key={priority.priority_id}
                                                    value={String(
                                                        priority.priority_id
                                                    )}
                                                >
                                                    {priority.priority_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="columns"
                render={({ field }) => (
                    <Fragment>
                        <h3 className="my-6 font-medium text-xl text-[#3F434A]">
                            {t('visible.table.columns')}
                        </h3>
                        <div className="flex border px-7 py-6 rounded-xl gap-x-20">
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="order_id"
                                    label={t('num')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.order_id}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            order_id: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="order_name"
                                    label={t('title')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.order_name}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            order_name: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="facility_name"
                                    label={t('facility')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.facility_name}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            facility_name: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="taskType"
                                    label={t('task.type')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.taskType}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            taskType: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="checkpoint_name"
                                    label={t('checkpoint')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.checkpoint_name}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            checkpoint_name: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="branch_name"
                                    label={t('branch')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.branch_name}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            branch_name: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="executor"
                                    label={t('executor')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.executor}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            executor: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="periodicity"
                                    label={t('periodicity')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.periodicity}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            periodicity: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="creator"
                                    label={t('task.creator')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.creator}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            creator: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="priority_name"
                                    label={t('priority')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.priority_name}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            priority_name: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="deliveryDate"
                                    label={t('date')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.deliveryDate}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            deliveryDate: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="ended_at_datetime"
                                    label={t('end.date')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.ended_at_datetime}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            ended_at_datetime: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="order_description"
                                    label={t('description')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.order_description}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            order_description: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="order_status_name"
                                    label={t('status')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.order_status_name}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            order_status_name: checked,
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </Fragment>
                )}
            />
            <Button className="w-[200px] mt-10 mr-4" type="submit">
                {t('button.action.apply')}
            </Button>
            <Button
                className="w-[200px] mt-10"
                type="button"
                variant="outline"
                onClick={handleFiltersReset}
            >
                {t('button.action.reset')}
            </Button>
        </CustomForm>
    )
}

export default TaskFiltersForm
