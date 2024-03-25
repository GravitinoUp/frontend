import {
    Dispatch,
    Fragment,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18next from '../../i18n.ts'
import { placeholderQuery } from '../tasklist/constants.ts'
import ArrowRight from '@/assets/icons/arrow_right.svg'
import {
    CustomAlert,
    ErrorCustomAlert,
} from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast'
import { useGetBranchesQuery } from '@/redux/api/branch.ts'
import { useGetCheckpointsByBranchQuery } from '@/redux/api/checkpoints.ts'
import { useGetFacilitiesByCheckpointQuery } from '@/redux/api/facility.ts'
import { useGetGroupsQuery } from '@/redux/api/groups'
import { useGetAllOrganizationTypesQuery } from '@/redux/api/organization-types'
import {
    useGetAllPermissionsQuery,
    useSetRolePermissionsMutation,
} from '@/redux/api/permissions.ts'
import { useGetRolesQuery } from '@/redux/api/roles'
import {
    useCreateOrganizationMutation,
    useCreateUserMutation,
    useUpdateOrganizationMutation,
    useUpdateUserMutation,
} from '@/redux/api/users'
import {
    OrganizationUserPayloadInterface,
    UserInterface,
    UserPayloadInterface,
} from '@/types/interface/user'

const userFormSchema = z
    .object({
        user_id: z.number().optional(),
        last_name: z
            .string()
            .min(1, { message: i18next.t('validation.require.last.name') })
            .refine((value) => /^[\u0400-\u04FF\s-]+$/.test(value), {
                message: i18next.t('validation.invalid.characters'),
            }),
        first_name: z
            .string()
            .min(1, { message: i18next.t('validation.require.first.name') })
            .refine((value) => /^[\u0400-\u04FF\s-]+$/.test(value), {
                message: i18next.t('validation.invalid.characters'),
            }),
        patronymic: z.string(),
        phone: z.string().refine((value) => /^[+]\d{11}$/.test(value), {
            message: i18next.t('validation.require.phone'),
        }),
        email: z.string().email(i18next.t('validation.require.email')),
        group_id: z.string().optional().nullable(),
        role_id: z
            .string()
            .min(1, { message: i18next.t('validation.require.role') }),
        password: z.string(),
        repeat_password: z.string(),
    })
    .refine(
        (data) =>
            (data.user_id && data.password === '') || data.password !== '',
        {
            message: i18next.t('validation.require.password'),
            path: ['password'],
        }
    )
    .refine((data) => data.password === data.repeat_password, {
        message: i18next.t('validation.require.password.mismatch'),
        path: ['repeat_password'],
    })

const organizationFormSchema = z
    .object({
        user_id: z.number().optional(),
        full_name: z
            .string()
            .min(1, { message: i18next.t('validation.require.full.name') }),
        short_name: z
            .string()
            .min(1, { message: i18next.t('validation.require.short.name') }),
        organization_type_id: z
            .string()
            .min(1, i18next.t('multiselect.placeholder.organization.type')),
        branch_id: z.string().min(1, i18next.t('validation.require.select')),
        checkpoint_id: z
            .string()
            .min(1, i18next.t('validation.require.select')),
        facility_id: z.string().min(1, i18next.t('validation.require.select')),
        phone: z.string().refine((value) => /^[+]\d{11}$/.test(value), {
            message: i18next.t('validation.require.phone'),
        }),
        email: z.string().email(i18next.t('validation.require.email')),
        password: z.string(),
        repeat_password: z.string(),
    })
    .refine(
        (data) =>
            (data.user_id && data.password === '') || data.password !== '',
        {
            message: i18next.t('validation.require.password'),
            path: ['password'],
        }
    )
    .refine((data) => data.password === data.repeat_password, {
        message: i18next.t('validation.require.password.mismatch'),
        path: ['repeat_password'],
    })

const permissionsFormSchema = z.object({
    permissions: z.array(z.number()),
})

interface AddUserFormProps {
    user?: UserInterface
    setDialogOpen: Dispatch<SetStateAction<boolean>>
}

const AddUserForm = ({ setDialogOpen, user }: AddUserFormProps) => {
    const { t } = useTranslation()
    const [tabValue, setTabValue] = useState('user')
    const [tabUserTypeValue, setTabUserTypeValue] = useState(
        !user || user.organization?.organization_id === null
            ? 'user'
            : 'organization'
    )
    const [permissionsSearch, setPermissionsSearch] = useState('')

    const userForm = useForm({
        schema: userFormSchema,
        defaultValues: user
            ? {
                  ...user,
                  user_id: user.user_id,
                  last_name: user.person.last_name,
                  first_name: user.person.first_name,
                  patronymic: user.person.patronymic,
                  phone: user.person.phone,
                  group_id:
                      user.group?.group_id !== null
                          ? String(user.group?.group_id)
                          : '',
                  role_id: String(user.role.role_id),
                  password: '',
                  repeat_password: '',
              }
            : {
                  last_name: '',
                  first_name: '',
                  patronymic: '',
                  email: '',
                  group_id: '',
                  role_id: '',
                  phone: '',
                  password: '',
                  repeat_password: '',
              },
    })

    const organizationForm = useForm({
        schema: organizationFormSchema,
        defaultValues: user
            ? {
                  ...user,
                  user_id: user.user_id,
                  full_name: user.organization?.full_name,
                  short_name: user.organization?.short_name,
                  phone: user.organization?.phone,
                  organization_type_id: String(
                      user.organization?.organization_type.organization_type_id
                  ),
                  password: '',
                  repeat_password: '',
              }
            : {
                  full_name: '',
                  short_name: '',
                  email: '',
                  phone: '',
                  organization_type_id: '',
                  branch_id: '',
                  checkpoint_id: '',
                  facility_id: '',
                  password: '',
                  repeat_password: '',
              },
    })

    const permissionsForm = useForm({
        schema: permissionsFormSchema,
        defaultValues: {
            permissions: [],
        },
    })

    // USERS
    const {
        data: roles = [],
        isLoading: rolesLoading,
        isError: rolesError,
        isSuccess: rolesSuccess,
    } = useGetRolesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    const {
        data: groups = [],
        isLoading: groupsLoading,
        isError: groupsError,
        isSuccess: groupsSuccess,
    } = useGetGroupsQuery(void 0, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    const {
        data: permissions = [],
        isError: permissionsError,
        isLoading: permissionsLoading,
        isSuccess: permissionsSuccess,
    } = useGetAllPermissionsQuery()

    const filteredPermissions = useMemo(
        () =>
            permissions.filter(({ permission_name }) =>
                permission_name
                    ?.toLowerCase()
                    ?.includes(permissionsSearch.toLowerCase())
            ),
        [permissionsSearch, permissions]
    )

    // ORGANIZATIONS
    const {
        data: organizationsTypes = [],
        isLoading: organizationsTypesLoading,
        isError: organizationsTypesError,
        isSuccess: organizationsTypesSuccess,
    } = useGetAllOrganizationTypesQuery(placeholderQuery)

    // BRANCHES
    const {
        data: branches = [],
        isLoading: branchesLoading,
        isError: branchesError,
        isSuccess: branchesSuccess,
    } = useGetBranchesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })
    const selectedBranch = organizationForm.watch('branch_id')

    // CHECKPOINTS
    const {
        data: checkpoints = [],
        isFetching: checkpointsLoading,
        isError: checkpointsError,
    } = useGetCheckpointsByBranchQuery(
        { body: placeholderQuery, branchIDS: [Number(selectedBranch)] },
        { skip: !selectedBranch }
    )
    const selectedCheckpoint = organizationForm.watch('checkpoint_id')

    // FACILITIES
    const {
        data: facilities = [],
        isFetching: facilitiesLoading,
        isError: facilitiesError,
    } = useGetFacilitiesByCheckpointQuery(
        { body: placeholderQuery, checkpointIDS: [Number(selectedCheckpoint)] },
        { skip: !selectedCheckpoint }
    )

    const [
        createUser,
        {
            data: newUser,
            isLoading: isUserAdding,
            error: userCreateError,
            isSuccess: userCreateSuccess,
        },
    ] = useCreateUserMutation()

    const [
        updateUser,
        {
            isLoading: isUserUpdating,
            error: userUpdateError,
            isSuccess: userUpdateSuccess,
        },
    ] = useUpdateUserMutation()

    const [
        createOrganization,
        {
            isLoading: isOrganizationAdding,
            error: organizationCreateError,
            isSuccess: organizationCreateSuccess,
        },
    ] = useCreateOrganizationMutation()

    const [
        updateOrganization,
        {
            isLoading: isOrganizationUpdating,
            error: organizationUpdateError,
            isSuccess: organizationUpdateSuccess,
        },
    ] = useUpdateOrganizationMutation()

    const [
        setUserPermissions,
        {
            isLoading: permissionsSetLoading,
            error: permissionsSetError,
            isSuccess: permissionsSetSuccess,
        },
    ] = useSetRolePermissionsMutation()

    const handleUserSubmit = (data: z.infer<typeof userFormSchema>) => {
        const userPayload: UserPayloadInterface = {
            last_name: data.last_name,
            first_name: data.first_name,
            patronymic: data.patronymic,
            phone: data.phone,
            role_id: Number(data.role_id),
            group_id: data.group_id ? Number(data.group_id) : null,
            email: data.email,
            password: data.password ? data.password : void 0,
        }

        if (!user) {
            createUser(userPayload)
        } else {
            updateUser({ ...userPayload, user_id: user.user_id })
        }
    }

    const handleOrganizationSubmit = (
        data: z.infer<typeof organizationFormSchema>
    ) => {
        const userPayload: OrganizationUserPayloadInterface = {
            organization_type_id: Number(data.organization_type_id),
            full_name: data.full_name,
            short_name: data.short_name,
            phone: data.phone,
            facility_ids: [Number(data.facility_id)],
            email: data.email,
            password: data.password ? data.password : void 0,
        }

        if (!user) {
            createOrganization(userPayload)
        } else {
            updateOrganization({ ...userPayload, user_id: user.user_id })
        }
    }

    const handlePermissionsSubmit = (
        data: z.infer<typeof permissionsFormSchema>
    ) => {
        const payload = {
            user_id: user ? user.user_id : newUser?.data?.user_id,
            permission_ids: data.permissions,
            rights: true,
        }
        setUserPermissions(payload)
    }

    const createSuccessMsg = useMemo(
        () =>
            t('toast.success.description.create.m', {
                entityType: t('user.title'),
            }),
        []
    )
    const updateSuccessMsg = useMemo(
        () =>
            t('toast.success.description.update.m', {
                entityType: t('user.title'),
            }),
        []
    )
    const permissionsSuccessMsg = useMemo(
        () => t('toast.success.description.permissions.set'),
        []
    )

    useSuccessToast(
        createSuccessMsg,
        userCreateSuccess || organizationCreateSuccess,
        userCreateSuccess ? setDialogOpen : void 0
    )
    useSuccessToast(
        updateSuccessMsg,
        userUpdateSuccess || organizationUpdateSuccess,
        setDialogOpen
    )
    useSuccessToast(permissionsSuccessMsg, permissionsSetSuccess, setDialogOpen)
    useErrorToast(
        void 0,
        userCreateError ||
            organizationCreateError ||
            userUpdateError ||
            organizationUpdateError ||
            permissionsSetError
    )

    useEffect(() => {
        if (userCreateSuccess) {
            setTabValue('permissions')
        }
    }, [userCreateSuccess])

    return (
        <Tabs
            value={!user ? tabValue : void 0}
            defaultValue={user ? 'user' : void 0}
            className="overflow-auto w-full h-full"
        >
            <TabsList className="gap-2">
                <TabsTrigger
                    value="user"
                    className="data-[state=active]:text-primary uppercase"
                >
                    {t('tabs.common')}
                </TabsTrigger>{' '}
                {tabUserTypeValue === 'user' && (
                    <>
                        <span className="pb-4">
                            <ArrowRight />
                        </span>
                        <TabsTrigger
                            value="permissions"
                            className="data-[state=active]:text-primary uppercase"
                        >
                            {t('tabs.permissions')}
                        </TabsTrigger>
                    </>
                )}
            </TabsList>
            <Separator className="w-full bg-[#E8E9EB]" decorative />
            <TabsContent value="user" className="w-full">
                <ScrollArea className="w-full h-[690px] pr-10">
                    <Tabs
                        value={tabUserTypeValue}
                        onValueChange={(value) => {
                            setTabUserTypeValue(value)
                            userForm.clearErrors()
                            userForm.reset()
                            organizationForm.clearErrors()
                            organizationForm.reset()
                        }}
                    >
                        {!user && (
                            <Fragment>
                                <p className="my-4 text-[#8A9099] text-sm font-medium">
                                    {t('user.type')}
                                </p>
                                <TabsList className="gap-2">
                                    <TabsTrigger
                                        className="bg-white border-accent text-black font-normal data-[state=active]:bg-[#3F434A] data-[state=active]:border-accent data-[state=active]:text-white py-1.5 px-4 rounded-3xl border-2"
                                        value="user"
                                    >
                                        {t('user.type.worker')}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="bg-white border-accent text-black font-normal data-[state=active]:bg-[#3F434A] data-[state=active]:border-accent data-[state=active]:text-white   py-1.5 px-4 rounded-3xl border-2"
                                        value="organization"
                                    >
                                        {t('user.type.organization')}
                                    </TabsTrigger>
                                </TabsList>
                            </Fragment>
                        )}
                        <TabsContent value="user">
                            <CustomForm
                                form={userForm}
                                onSubmit={handleUserSubmit}
                            >
                                <FormField
                                    control={userForm.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('user.last.name')}
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('user.first.name')}
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="patronymic"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('user.patronymic')}
                                            className="mt-5"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('user.phone')}
                                            className="mt-5"
                                            maxLength={12}
                                            autoComplete="phone"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <InputField
                                            label="Email"
                                            className="mt-5"
                                            autoComplete="email"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="group_id"
                                    render={({ field }) => (
                                        <FormItem className="w-full mt-5">
                                            <FormLabel>{t('group')}</FormLabel>
                                            {groupsLoading && (
                                                <Skeleton className="h-10 w-[494px] rounded-xl" />
                                            )}
                                            {groupsError && (
                                                <CustomAlert
                                                    message={t(
                                                        'multiselect.error.groups'
                                                    )}
                                                />
                                            )}
                                            {groupsSuccess &&
                                                groups?.length > 0 && (
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
                                                                        'multiselect.placeholder.group'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {groups.map(
                                                                (group) => (
                                                                    <SelectItem
                                                                        key={
                                                                            group.group_id
                                                                        }
                                                                        value={String(
                                                                            group.group_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            group.group_name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="role_id"
                                    render={({ field }) => (
                                        <FormItem className="w-full mt-5">
                                            <FormLabel className="label-required">
                                                {t('role')}
                                            </FormLabel>
                                            {rolesLoading && (
                                                <Skeleton className="h-10 w-[494px] rounded-xl" />
                                            )}
                                            {rolesError && (
                                                <CustomAlert
                                                    message={t(
                                                        'multiselect.error.roles'
                                                    )}
                                                />
                                            )}
                                            {rolesSuccess &&
                                                roles?.length > 0 && (
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
                                                                        'multiselect.placeholder.role'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {roles.map(
                                                                (role) => (
                                                                    <SelectItem
                                                                        key={
                                                                            role.role_id
                                                                        }
                                                                        value={String(
                                                                            role.role_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            role.role_name
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
                                <FormField
                                    control={userForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('authorization.password')}
                                            type="password"
                                            className="mt-5"
                                            autoComplete="new-password"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />

                                <FormField
                                    control={userForm.control}
                                    name="repeat_password"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('repeat.password')}
                                            type="password"
                                            className="mt-5"
                                            autoComplete="new-password"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                {userCreateError && (
                                    <ErrorCustomAlert error={userCreateError} />
                                )}
                                {userUpdateError && (
                                    <ErrorCustomAlert error={userUpdateError} />
                                )}
                                <Button
                                    className="w-[100px] mt-10 mr-4"
                                    type="submit"
                                    disabled={isUserAdding || isUserUpdating}
                                >
                                    {isUserAdding || isUserUpdating ? (
                                        <LoadingSpinner />
                                    ) : !user ? (
                                        t('button.action.create')
                                    ) : (
                                        t('button.action.save')
                                    )}
                                </Button>
                            </CustomForm>
                        </TabsContent>
                        <TabsContent value="organization">
                            <CustomForm
                                form={organizationForm}
                                onSubmit={handleOrganizationSubmit}
                            >
                                <FormField
                                    control={organizationForm.control}
                                    name="short_name"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('user.organization')}
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('title.full')}
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('user.phone')}
                                            className="mt-5"
                                            maxLength={12}
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <InputField
                                            label="Email"
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="organization_type_id"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel className="label-required">
                                                {t('organization.type')}
                                            </FormLabel>
                                            {organizationsTypesLoading && (
                                                <Skeleton className="h-10 w-[494px] rounded-xl" />
                                            )}
                                            {organizationsTypesError && (
                                                <CustomAlert
                                                    message={t(
                                                        'multiselect.error.organization.types'
                                                    )}
                                                />
                                            )}
                                            {organizationsTypesSuccess &&
                                                organizationsTypes?.length >
                                                    0 && (
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
                                                                        'multiselect.placeholder.organization.type'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {organizationsTypes.map(
                                                                (
                                                                    organizationsType
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            organizationsType.organization_type_id
                                                                        }
                                                                        value={String(
                                                                            organizationsType.organization_type_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            organizationsType.organization_type_name
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
                                <FormField
                                    control={organizationForm.control}
                                    name="branch_id"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel className="label-required">
                                                {t('branch')}
                                            </FormLabel>
                                            {branchesLoading && (
                                                <Skeleton className="h-10 w-[494px] rounded-xl" />
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
                                                                        'multiselect.placeholder.branch'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {branches.map(
                                                                ({
                                                                    branch_id,
                                                                    branch_name,
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            branch_id
                                                                        }
                                                                        value={String(
                                                                            branch_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            branch_name
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
                                <FormField
                                    control={organizationForm.control}
                                    name="checkpoint_id"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel className="label-required">
                                                {t('checkpoint')}
                                            </FormLabel>
                                            {checkpointsLoading && (
                                                <Skeleton className="h-10 w-[494px] rounded-xl" />
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
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={String(
                                                            field.value
                                                        )}
                                                        disabled={
                                                            !selectedBranch
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={
                                                                        selectedBranch
                                                                            ? t(
                                                                                  'multiselect.placeholder.checkpoint'
                                                                              )
                                                                            : t(
                                                                                  'multiselect.placeholder.checkpoint.disabled'
                                                                              )
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {checkpoints.map(
                                                                ({
                                                                    checkpoint_id,
                                                                    checkpoint_name,
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            checkpoint_id
                                                                        }
                                                                        value={String(
                                                                            checkpoint_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            checkpoint_name
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
                                <FormField
                                    control={organizationForm.control}
                                    name="facility_id"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel className="label-required">
                                                {t('facility')}
                                            </FormLabel>
                                            {facilitiesLoading && (
                                                <Skeleton className="h-10 w-[494px] rounded-xl" />
                                            )}
                                            {facilitiesError && (
                                                <CustomAlert
                                                    message={t(
                                                        'multiselect.error.facility'
                                                    )}
                                                />
                                            )}
                                            {!facilitiesError &&
                                                !facilitiesLoading && (
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={String(
                                                            field.value
                                                        )}
                                                        disabled={
                                                            !selectedCheckpoint
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={
                                                                        selectedCheckpoint
                                                                            ? t(
                                                                                  'multiselect.placeholder.facility'
                                                                              )
                                                                            : t(
                                                                                  'multiselect.placeholder.facility.disabled'
                                                                              )
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {facilities.map(
                                                                ({
                                                                    facility_id,
                                                                    facility_name,
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            facility_id
                                                                        }
                                                                        value={String(
                                                                            facility_id
                                                                        )}
                                                                    >
                                                                        {
                                                                            facility_name
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
                                <FormField
                                    control={organizationForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('authorization.password')}
                                            type="password"
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="repeat_password"
                                    render={({ field }) => (
                                        <InputField
                                            label={t('repeat.password')}
                                            type="password"
                                            className="mt-5"
                                            {...field}
                                            isRequired
                                        />
                                    )}
                                />
                                {organizationCreateError && (
                                    <ErrorCustomAlert
                                        error={organizationCreateError}
                                    />
                                )}
                                {organizationUpdateError && (
                                    <ErrorCustomAlert
                                        error={organizationUpdateError}
                                    />
                                )}
                                <Button
                                    className="w-[100px] mt-10 mr-4"
                                    type="submit"
                                    disabled={
                                        isOrganizationAdding ||
                                        isOrganizationUpdating
                                    }
                                >
                                    {isOrganizationAdding ||
                                    isOrganizationUpdating ? (
                                        <LoadingSpinner />
                                    ) : !user ? (
                                        t('button.action.create')
                                    ) : (
                                        t('button.action.save')
                                    )}
                                </Button>
                            </CustomForm>
                        </TabsContent>
                    </Tabs>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </TabsContent>
            {tabUserTypeValue === 'user' && (
                <TabsContent value="permissions" className="w-full h-[690px]">
                    <CustomForm
                        form={permissionsForm}
                        onSubmit={handlePermissionsSubmit}
                    >
                        <FormField
                            control={permissionsForm.control}
                            name="permissions"
                            render={() => (
                                <FormItem className="mt-4">
                                    <FormLabel>{t('permissions')}</FormLabel>
                                    <ScrollArea className="h-[445px] w-full rounded-md border px-4 py-4">
                                        <InputField
                                            className="mb-5 mt-1"
                                            value={permissionsSearch}
                                            onChange={(e) =>
                                                setPermissionsSearch(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t(
                                                'placeholder.search'
                                            )}
                                            disabled={
                                                permissionsLoading ||
                                                permissionsError
                                            }
                                        />
                                        {permissionsError && (
                                            <CustomAlert
                                                message={t(
                                                    'multiselect.error.permissions'
                                                )}
                                            />
                                        )}
                                        {permissionsLoading && (
                                            <div className="flex flex-col gap-1">
                                                <Skeleton className="h-5 w-[228px] rounded-xl" />
                                                <Skeleton className="h-5 w-[228px] rounded-xl" />
                                                <Skeleton className="h-5 w-[228px] rounded-xl" />
                                            </div>
                                        )}
                                        {permissionsSuccess &&
                                            permissions.length > 0 &&
                                            filteredPermissions.map(
                                                ({
                                                    permission_id: id,
                                                    permission_name: label,
                                                }) => (
                                                    <FormField
                                                        key={id}
                                                        control={
                                                            permissionsForm.control
                                                        }
                                                        name="permissions"
                                                        render={({ field }) => (
                                                            <FormItem
                                                                key={id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            id
                                                                        )}
                                                                        disabled={
                                                                            permissionsLoading
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            const permissions =
                                                                                checked
                                                                                    ? [
                                                                                          ...field.value,
                                                                                          id,
                                                                                      ]
                                                                                    : field.value.filter(
                                                                                          (
                                                                                              value
                                                                                          ) =>
                                                                                              value !==
                                                                                              id
                                                                                      )
                                                                            permissionsForm.setValue(
                                                                                'permissions',
                                                                                permissions
                                                                            )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                )
                                            )}
                                    </ScrollArea>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="absolute bottom-8">
                            <Button
                                className="w-[150px] mt-10 mr-4"
                                type="submit"
                                disabled={
                                    permissionsSetLoading || permissionsError
                                }
                            >
                                {permissionsSetLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    t('button.action.permissions.set')
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-[150px] mt-10 mr-4"
                                onClick={() => setDialogOpen(false)}
                            >
                                Отменить
                            </Button>
                        </div>
                    </CustomForm>
                </TabsContent>
            )}
        </Tabs>
    )
}

export default AddUserForm
