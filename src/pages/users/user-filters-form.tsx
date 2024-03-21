import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import FilterFormTitle from '@/components/form/filter-title'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { useGetAllOrganizationsQuery } from '@/redux/api/organizations'
import { useGetRolesQuery } from '@/redux/api/roles'

const filterSchema = z.object({
    last_name: z.string().optional(),
    first_name: z.string().optional(),
    patronymic: z.string().optional(),
    organization_id: z.number().optional(),
    role_id: z.number().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    status: z.boolean().nullable().optional(),
})

const placeholderQuery = {
    offset: {
        count: 50,
        page: 1,
    },
    filter: {},
    sorts: {},
}

interface UserFiltersFormProps {
    handleSubmit: (values: z.infer<typeof filterSchema>) => void
    data?: z.infer<typeof filterSchema>
}

const UserFiltersForm = ({ handleSubmit, data }: UserFiltersFormProps) => {
    const form = useForm({
        schema: filterSchema,
        defaultValues: data,
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
        data: roles = [],
        isLoading: rolesLoading,
        isError: rolesError,
        isSuccess: rolesSuccess,
    } = useGetRolesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    const { t } = useTranslation()

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <div className="flex gap-9 mt-12">
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FilterFormTitle title={t('user.last.name')} />
                            <InputField
                                placeholder={t('user.last.name')}
                                {...field}
                            />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FilterFormTitle title={t('user.first.name')} />
                            <InputField
                                placeholder={t('user.first.name')}
                                {...field}
                            />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="patronymic"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FilterFormTitle title={t('user.patronymic')} />
                            <InputField
                                placeholder={t('user.patronymic')}
                                {...field}
                            />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex gap-9 mt-8">
                <FormField
                    control={form.control}
                    name="organization_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('organization')} />
                            {organizationsLoading && (
                                <Skeleton className="h-10 w-[470px] rounded-xl" />
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
                    name="role_id"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('role')} />
                            {rolesLoading && (
                                <Skeleton className="h-10 w-[470px] rounded-xl" />
                            )}
                            {rolesError && (
                                <CustomAlert
                                    message={t('multiselect.error.roles')}
                                />
                            )}
                            {rolesSuccess && roles?.length > 0 && (
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
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.role_id}
                                                    value={String(role.role_id)}
                                                >
                                                    {role.role_name}
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
            <div className="flex max-[940px]:flex-wrap gap-9 mt-8">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FilterFormTitle title={t('status')} />
                            <div className="flex gap-7">
                                <Button
                                    type="button"
                                    className={cn(
                                        field.value === true
                                            ? 'bg-[#3F434A] text-background'
                                            : 'bg-background text-[#3F434A]',
                                        'py-3 px-16 rounded-xl border-2 border-[#3F434A] hover:bg-[#3F434A] hover:text-background w-full'
                                    )}
                                    onClick={() => {
                                        field.onChange(true)
                                    }}
                                >
                                    {t('user.active')}
                                </Button>
                                <Button
                                    type="button"
                                    className={cn(
                                        field.value === false
                                            ? 'bg-[#3F434A] text-background'
                                            : 'bg-background text-[#3F434A]',
                                        'py-3 px-16 rounded-xl border-2 border-[#3F434A] hover:bg-[#3F434A] hover:text-background w-full'
                                    )}
                                    onClick={() => {
                                        field.onChange(false)
                                    }}
                                >
                                    {t('user.inactive')}
                                </Button>
                            </div>
                        </FormItem>
                    )}
                />
                <div className="bg-muted p-4 rounded-xl w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex items-center w-full">
                                <h3 className="font-medium text-xl text-[#3F434A] w-full">
                                    Email
                                </h3>
                                <InputField
                                    className="w-full"
                                    placeholder="Email"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex items-center w-full">
                                <h3 className="font-medium text-xl text-[#3F434A] w-full">
                                    {t('user.phone')}
                                </h3>
                                <InputField
                                    className="w-full"
                                    placeholder={t('user.phone')}
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <Button className="w-[200px] mt-10 mr-4" type="submit">
                {t('button.action.apply')}
            </Button>
            <Button
                className="w-[200px] mt-10"
                type="button"
                variant="outline"
                onClick={() => {
                    form.reset({
                        last_name: '',
                        first_name: '',
                        patronymic: '',
                        organization_id: 0,
                        role_id: 0,
                        email: '',
                        phone: '',
                        status: null,
                    })
                }}
            >
                {t('button.action.reset')}
            </Button>
        </CustomForm>
    )
}

export default UserFiltersForm
