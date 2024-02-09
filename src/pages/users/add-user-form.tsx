import { Dispatch, SetStateAction, useState } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'
import { z } from 'zod'
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
import { useGetAllOrganizationTypesQuery } from '@/redux/api/organization-types'
import { OrganizationTypePayloadInterface } from '@/types/interface/organizations'
import { UserInterface } from '@/types/interface/user'

const formSchema = z.object({
    type: z.string(),
    first_name: z.string().min(1, { message: 'Необходимо добавить название' }),
    last_name: z.string().min(1, { message: 'Необходимо добавить название' }),
    patronymic: z.string().min(1, { message: 'Необходимо добавить название' }),
    phone: z.string().refine((value) => /^\d{11}$/.test(value), {
        message: 'Номер должен быть в формате: 7XXXXXXXXXX',
    }),
    email: z.string(),
    organization_id: z.string({
        required_error: 'Тип организации должен быть выбран',
    }),
    role_id: z.string({
        required_error: 'Тип организации должен быть выбран',
    }),
    organization_type_id: z.string(),
    full_name: z.string(),
    short_name: z.string(),
    group_id: z.string(),
    password: z.string().min(1, { message: '' }),
    repassword: z.string().min(1, { message: '' }),
})

interface AddUserFormProps {
    user?: UserInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddUserForm = ({ setDialogOpen, user }: AddUserFormProps) => {
    const form = useForm({
        schema: formSchema,
        defaultValues: !user
            ? {
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone: '',
                  organization_id: '',
                  role_id: '',
              }
            : {
                  first_name: user.person.first_name,
                  last_name: user.person.last_name,
                  email: user.email,
                  phone: user.person.phone,
                  organization_id: `${user.organization.organization_id}`,
                  role_id: `${user.role.role_id}`,
              },
    })

    const organizationsTypesQuery: OrganizationTypePayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
    }
    const {
        data: organizationsTypes = [],
        isLoading: organizationsTypesLoading,
        isError: organizationsTypesError,
        isSuccess: organizationsTypesSuccess,
    } = useGetAllOrganizationTypesQuery(organizationsTypesQuery)

    const [shown, setShown] = useState(false)
    const [repeat, setRepeat] = useState(false)

    return (
        <CustomForm form={form} onSubmit={() => {}}>
            <Tabs defaultValue="user" className="overflow-auto  w-full h-full">
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
                            defaultValue="user"
                            onValueChange={() => {
                                form.clearErrors()
                                form.reset()
                            }}
                        >
                            <p className="mt-3 text-[#8A9099] text-sm font-medium">
                                Тип пользователя
                            </p>
                            <TabsList className="gap-2">
                                <TabsTrigger
                                    className="bg-white border-accent text-black  data-[state=active]:bg-[#3F434A] data-[state=active]:border-accent data-[state=active]:text-white py-1.5 px-4 rounded-3xl border-2"
                                    value="user"
                                >
                                    Работник
                                </TabsTrigger>
                                <TabsTrigger
                                    className="bg-white border-accent text-black  data-[state=active]:bg-[#3F434A] data-[state=active]:border-accent data-[state=active]:text-white   py-1.5 px-4 rounded-3xl border-2"
                                    value="organization"
                                >
                                    Подрядчик
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="user">
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <InputField
                                            label="Телефон"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <InputField
                                            label="Пароль"
                                            type={!shown ? 'password' : 'text'}
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="repassword"
                                    render={({ field }) => (
                                        <InputField
                                            label="Подтвердить пароль"
                                            type="password"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="organization">
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <InputField
                                            label="Телефон"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <InputField
                                            label="Пароль"
                                            type={!shown ? 'password' : 'text'}
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="repassword"
                                    render={({ field }) => (
                                        <InputField
                                            label="Подтвердить пароль"
                                            type="password"
                                            className="mt-3"
                                            {...field}
                                        />
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                        <Button className="mt-10 mr-4   " type="submit">
                            Создать
                        </Button>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="role" className="w-full"></TabsContent>
                <TabsContent value="image" className="w-full"></TabsContent>
            </Tabs>
        </CustomForm>
    )
}

export default AddUserForm
