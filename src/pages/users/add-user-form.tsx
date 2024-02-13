import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { z } from 'zod'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useGetGroupsQuery } from '@/redux/api/groups'
import { useGetAllOrganizationTypesQuery } from '@/redux/api/organization-types'
import { useGetRolesQuery } from '@/redux/api/roles'
import {
    useCreateOrganizationUserMutation,
    useCreateUserMutation,
} from '@/redux/api/users'
import {
    OrganizationUserPayloadInterface,
    UserInterface,
    UserPayloadInterface,
} from '@/types/interface/user'

const userFormSchema = z.object({
    last_name: z.string().min(1, { message: 'Необходимо добавить фамилию' }),
    first_name: z.string().min(1, { message: 'Необходимо добавить имя' }),
    patronymic: z.string(),
    phone: z.string().refine((value) => /^\d{11}$/.test(value), {
        message: 'Номер должен быть в формате: 7XXXXXXXXXX',
    }),
    email: z.string(),
    password: z.string().min(1, { message: 'Укажите пароль' }),
    repeat_password: z.string().min(1, { message: 'Укажите пароль' }),
})

const organizationFormSchema = z.object({
    full_name: z.string(),
    short_name: z.string(),
    organization_type_id: z.string(),
    phone: z.string().refine((value) => /^\d{11}$/.test(value), {
        message: 'Номер должен быть в формате: 7XXXXXXXXXX',
    }),
    email: z.string(),
    password: z.string().min(1, { message: 'Укажите пароль' }),
    repeat_password: z.string().min(1, { message: 'Укажите пароль' }),
})

const roleFormSchema = z.object({
    role_id: z
        .string()
        .refine((value) => value !== '', 'Роль должна быть выбрана'),
    group_id: z.string().optional(),
})

const imageFormSchema = z.object({
    image: z.string(),
})

interface AddUserFormProps {
    user?: UserInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddUserForm = ({ setDialogOpen }: AddUserFormProps) => {
    const { toast } = useToast()

    const userForm = useForm({
        schema: userFormSchema,
        defaultValues: {
            last_name: '',
            first_name: '',
            patronymic: '',
            email: '',
            phone: '',
            password: '',
            repeat_password: '',
        },
    })

    const organizationForm = useForm({
        schema: organizationFormSchema,
        defaultValues: {
            full_name: '',
            short_name: '',
            email: '',
            phone: '',
            password: '',
            repeat_password: '',
        },
    })

    const roleForm = useForm({
        schema: roleFormSchema,
        defaultValues: {
            role_id: '',
        },
    })

    const imageForm = useForm({
        schema: imageFormSchema,
        defaultValues: {
            image: '',
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
    } = useGetGroupsQuery(undefined, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    // ORGANIZATIONS

    const {
        data: organizationsTypes = [],
        isLoading: organizationsTypesLoading,
        isError: organizationsTypesError,
        isSuccess: organizationsTypesSuccess,
    } = useGetAllOrganizationTypesQuery(placeholderQuery)

    const [
        createUser,
        {
            isLoading: isUserAdding,
            isError: userCreateError,
            isSuccess: userCreateSuccess,
        },
    ] = useCreateUserMutation()

    const [
        createOrganization,
        {
            isLoading: isOrganizationAdding,
            isError: organizationCreateError,
            isSuccess: organizationCreateSuccess,
        },
    ] = useCreateOrganizationUserMutation()

    const [tabValue, setTabValue] = useState('user')
    const [tabUserTypeValue, setTabUserTypeValue] = useState('user')

    function handleUserSubmit() {
        setTabValue('role')
    }

    function handleOrganizationSubmit() {
        setTabValue('role')
    }

    function handleRoleSubmit() {
        setTabValue('image')
    }

    function handleImageSubmit() {
        if (tabUserTypeValue === 'user') {
            const userFormValues = userForm.getValues()
            const roleFormValues = roleForm.getValues()

            const userPayload: UserPayloadInterface = {
                last_name: userFormValues.last_name,
                first_name: userFormValues.first_name,
                patronymic: userFormValues.patronymic,
                phone: userFormValues.phone,
                role_id: roleFormValues.role_id,
                group_id: roleFormValues.group_id,
                email: userFormValues.email,
                password: userFormValues.password,
            }

            createUser(userPayload)
        } else {
            const organizationFormValue = organizationForm.getValues()
            const roleFormValues = roleForm.getValues()

            const userPayload: OrganizationUserPayloadInterface = {
                organization_type_id:
                    organizationFormValue.organization_type_id,
                full_name: organizationFormValue.full_name,
                short_name: organizationFormValue.short_name,
                phone: organizationFormValue.phone,
                role_id: roleFormValues.role_id,
                group_id: roleFormValues.group_id,
                email: organizationFormValue.email,
                password: organizationFormValue.password,
            }

            createOrganization(userPayload)
        }
    }

    useEffect(() => {
        if (userCreateSuccess || organizationCreateSuccess) {
            toast({
                description: `Пользователь успешно создан`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [userCreateSuccess, organizationCreateSuccess])

    return (
        <Tabs
            value={tabValue}
            onValueChange={setTabValue}
            className="overflow-auto w-full h-full"
        >
            <TabsList className="gap-2">
                <TabsTrigger
                    value="user"
                    className="data-[state=active]:text-primary"
                >
                    ОБЩЕЕ
                </TabsTrigger>
                <TabsTrigger
                    value="role"
                    className="data-[state=active]:text-primary"
                >
                    РОЛИ И ПРАВА ДОСТУПА
                </TabsTrigger>
                <TabsTrigger
                    value="image"
                    className="data-[state=active]:text-primary"
                >
                    ИЗОБРАЖЕНИЕ
                </TabsTrigger>
            </TabsList>
            <Separator className="w-full bg-[#E8E9EB]" decorative />
            <TabsContent value="user" className="w-full">
                <ScrollArea className="w-full h-[600px] pr-3">
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
                        <p className="mt-3 mb-4 text-[#8A9099] text-sm font-medium">
                            Тип пользователя
                        </p>
                        <TabsList className="gap-2">
                            <TabsTrigger
                                className="bg-white border-accent text-black font-normal data-[state=active]:bg-[#3F434A] data-[state=active]:border-accent data-[state=active]:text-white py-1.5 px-4 rounded-3xl border-2"
                                value="user"
                            >
                                Работник
                            </TabsTrigger>
                            <TabsTrigger
                                className="bg-white border-accent text-black font-normal data-[state=active]:bg-[#3F434A] data-[state=active]:border-accent data-[state=active]:text-white   py-1.5 px-4 rounded-3xl border-2"
                                value="organization"
                            >
                                Подрядчик
                            </TabsTrigger>
                        </TabsList>

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
                                            label="Фамилия"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <InputField
                                            label="Имя"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="patronymic"
                                    render={({ field }) => (
                                        <InputField
                                            label="Отчество"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <InputField
                                            label="Телефон"
                                            className="mt-3"
                                            maxLength={11}
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <InputField
                                            label="Email"
                                            type="email"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <InputField
                                            label="Пароль"
                                            type="password"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={userForm.control}
                                    name="repeat_password"
                                    render={({ field }) => (
                                        <InputField
                                            label="Подтвердить пароль"
                                            type="password"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <Button
                                    className="w-[100px] mt-10 mr-4"
                                    type="submit"
                                >
                                    Далее
                                </Button>
                                <Button
                                    className="w-[100px] mt-10"
                                    type="button"
                                    variant={'outline'}
                                    onClick={() => setDialogOpen!(false)}
                                >
                                    Отменить
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
                                            label="Название организации"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <InputField
                                            label="Полное название"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <InputField
                                            label="Телефон"
                                            className="mt-3"
                                            maxLength={11}
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <InputField
                                            label="Email"
                                            type="email"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="organization_type_id"
                                    render={({ field }) => (
                                        <FormItem className="mt-3">
                                            <FormLabel>
                                                Профиль организации
                                            </FormLabel>
                                            {organizationsTypesLoading && (
                                                <LoadingSpinner />
                                            )}
                                            {organizationsTypesError && (
                                                <CustomAlert message="Приоритеты не загрузились. Попробуйте позднее." />
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
                                                                <SelectValue placeholder="Установите приоритет" />
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
                                    name="password"
                                    render={({ field }) => (
                                        <InputField
                                            label="Пароль"
                                            type="password"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={organizationForm.control}
                                    name="repeat_password"
                                    render={({ field }) => (
                                        <InputField
                                            label="Подтвердить пароль"
                                            type="password"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <Button
                                    className="w-[100px] mt-10 mr-4"
                                    type="submit"
                                >
                                    Далее
                                </Button>
                                <Button
                                    className="w-[100px] mt-10"
                                    type="button"
                                    variant={'outline'}
                                    onClick={() => setDialogOpen!(false)}
                                >
                                    Отменить
                                </Button>
                            </CustomForm>
                        </TabsContent>
                    </Tabs>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </TabsContent>
            <TabsContent value="role" className="w-full">
                <CustomForm form={roleForm} onSubmit={handleRoleSubmit}>
                    <FormField
                        control={roleForm.control}
                        name="role_id"
                        render={({ field }) => (
                            <FormItem className="w-full mt-3">
                                <FormLabel>Роль</FormLabel>
                                {rolesLoading && <LoadingSpinner />}
                                {rolesError && (
                                    <CustomAlert message="Роли не загрузились. Попробуйте позднее." />
                                )}
                                {rolesSuccess && roles?.length > 0 && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите роль" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={roleForm.control}
                        name="group_id"
                        render={({ field }) => (
                            <FormItem className="w-full mt-3">
                                <FormLabel>Группа</FormLabel>
                                {groupsLoading && <LoadingSpinner />}
                                {groupsError && (
                                    <CustomAlert message="Группы не загрузились. Попробуйте позднее." />
                                )}
                                {groupsSuccess && groups?.length > 0 && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите группу" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {groups.map((group) => (
                                                <SelectItem
                                                    key={group.group_id}
                                                    value={String(
                                                        group.group_id
                                                    )}
                                                >
                                                    {group.group_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormItem>
                        )}
                    />
                    <Button className="w-[100px] mt-10 mr-4" type="submit">
                        Далее
                    </Button>
                    <Button
                        className="w-[100px] mt-10"
                        type="button"
                        variant={'outline'}
                        onClick={() => setTabValue('user')}
                    >
                        Назад
                    </Button>
                </CustomForm>
            </TabsContent>
            <TabsContent value="image" className="w-full">
                <CustomForm form={imageForm} onSubmit={handleImageSubmit}>
                    {(userCreateError || organizationCreateError) && (
                        <CustomAlert className="mt-3" />
                    )}
                    <Button className="w-[100px] mt-10 mr-4" type="submit">
                        {isUserAdding || isOrganizationAdding ? (
                            <LoadingSpinner />
                        ) : (
                            'Создать'
                        )}
                    </Button>
                    <Button
                        className="w-[100px] mt-10"
                        type="button"
                        variant={'outline'}
                        onClick={() => setTabValue('role')}
                    >
                        Назад
                    </Button>
                </CustomForm>
            </TabsContent>
        </Tabs>
    )
}

export default AddUserForm
