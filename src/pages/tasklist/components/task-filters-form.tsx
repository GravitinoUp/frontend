import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { initialColumnVisibility } from '../constants.ts'
import { tasksColumnsSchema } from '../tasks-columns.tsx'
import { CustomAlert } from '@/components/custom-alert/custom-alert.tsx'
import CustomForm, { useForm } from '@/components/form/form.tsx'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { TASK_STATUSES } from '@/constants/constants.ts'
import { cn } from '@/lib/utils.ts'
import { useGetBranchesQuery } from '@/redux/api/branch.ts'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints.ts'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations.ts'
import { useGetAllPriorityQuery } from '@/redux/api/priority.ts'

const filterSchema = z.object({
    branch_id: z.number().optional(),
    checkpoint_id: z.number().optional(),
    organization_id: z.number().optional(),
    priority_id: z.number().optional(),
    order_status: z.array(z.string()),
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

const FilterFormTitle = ({ title }: { title: string }) => (
    <FormLabel className="inline-block mb-3 font-medium text-xl text-[#3F434A]">
        {title}
    </FormLabel>
)

interface TaskFiltersFormProps {
    handleSubmit: (values: z.infer<typeof filterSchema>) => void
    data?: z.infer<typeof filterSchema>
}

const TaskFiltersForm = ({ handleSubmit, data }: TaskFiltersFormProps) => {
    const form = useForm({
        schema: filterSchema,
        defaultValues: data,
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

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <div className="flex gap-16 mt-12">
                <FormField
                    control={form.control}
                    name="branch_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('branch')} />
                            {branchesLoading && <LoadingSpinner />}
                            {branchesError && (
                                <CustomAlert message={t('multiselect.error.branch')} />
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
                                                    : undefined,
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
                                                        branch.branch_id,
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
                            {checkpointsLoading && <LoadingSpinner />}
                            {checkpointsError && (
                                <CustomAlert message={t('multiselect.error.checkpoint')} />
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
                                                    : undefined,
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
                                                        checkpoint.checkpoint_id,
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
                            {organizationsLoading && <LoadingSpinner />}
                            {organizationsError && (
                                <CustomAlert message={t('multiselect.error.organization')} />
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
                                                        : undefined,
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
                                                                organization.organization_id,
                                                            )}
                                                        >
                                                            {
                                                                organization.short_name
                                                            }
                                                        </SelectItem>
                                                    ),
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
                            {prioritiesLoading && <LoadingSpinner />}
                            {prioritiesError && (
                                <CustomAlert message={t('multiselect.error.priority')} />
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
                                                    : undefined,
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
                                                        priority.priority_id,
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
                name="order_status"
                render={({ field }) => (
                    <Fragment>
                        <h3 className="mt-6 mb-3 font-medium text-xl text-[#3F434A]">
                            {t('status')}
                        </h3>
                        <div className="flex flex-wrap gap-7">
                            {Object.values(TASK_STATUSES).map((status) => (
                                <Button
                                    key={status}
                                    type="button"
                                    className={cn(
                                        field.value.find(
                                            (value) => value === status,
                                        )
                                            ? 'bg-[#3F434A] text-background'
                                            : 'bg-background text-[#3F434A]',
                                        'py-3 px-16 rounded-xl border-2 border-[#3F434A] hover:bg-[#3F434A] hover:text-background',
                                    )}
                                    onClick={() => {
                                        if (
                                            !field.value.find(
                                                (value) => value === status,
                                            )
                                        ) {
                                            field.onChange([
                                                ...field.value,
                                                status,
                                            ])
                                        } else {
                                            field.onChange(
                                                field.value.filter(
                                                    (value) => value !== status,
                                                ),
                                            )
                                        }
                                    }}
                                >
                                    {status[0].toUpperCase() + status.slice(1)}
                                </Button>
                            ))}
                            <FormMessage />
                        </div>
                    </Fragment>
                )}
            />
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
                                    id="number"
                                    label={t('num')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.id}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            id: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="checkpoint"
                                    label={t('checkpoint')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.checkpoint}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            checkpoint: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="taskDescription"
                                    label={t('description')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.taskDescription}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            taskDescription: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="status"
                                    label={t('status')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.status}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            status: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="taskName"
                                    label={t('title')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.taskName}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            taskName: checked,
                                        })
                                    }}
                                />
                                <Checkbox
                                    id="priorityStatus"
                                    label={t('priority')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.priorityStatus}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            priorityStatus: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
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
                                    id="facility"
                                    label={t('facility')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.facility}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            facility: checked,
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <Checkbox
                                    id="branch"
                                    label={t('branch')}
                                    className="bg-[#F8F8F8] border-[#E8E9EB]"
                                    checked={field.value.branch}
                                    onCheckedChange={(checked) => {
                                        field.onChange({
                                            ...field.value,
                                            branch: checked,
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
                onClick={() => {
                    form.reset({
                        branch_id: 0,
                        checkpoint_id: 0,
                        organization_id: 0,
                        priority_id: 0,
                        order_status: [],
                        columns: initialColumnVisibility,
                    })
                }}
            >
                {t('button.action.reset')}
            </Button>
        </CustomForm>
    )
}

export default TaskFiltersForm
