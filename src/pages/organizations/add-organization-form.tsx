import { Dispatch, Fragment, SetStateAction, useEffect } from 'react'
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
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useGetAllOrganizationTypesQuery } from '@/redux/api/organization-types'
import {
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
} from '@/redux/api/organizations'
import {
    CreateOrganizationPayloadInterface,
    OrganizationInterface,
    OrganizationTypePayloadInterface,
} from '@/types/interface/organizations'

const formSchema = z.object({
    full_name: z.string().min(1, { message: 'Необходимо добавить название' }),
    short_name: z
        .string()
        .min(1, { message: 'Необходимо добавить короткое название' }),
    register_number: z.string().refine((value) => /^\d+$/.test(value), {
        message: 'Регистрационный номер может содержать только цифры',
    }),
    phone: z.string().refine((value) => /^\d{11}$/.test(value), {
        message: 'Номер должен быть в формате: 7XXXXXXXXXX',
    }),
    email: z.string().nullable(),
    organization_type_id: z.string({
        required_error: 'Тип организации должен быть выбран',
    }),
})

interface AddOrganizationFormProps {
    organization?: OrganizationInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddOrganizationForm = ({
    setDialogOpen,
    organization,
}: AddOrganizationFormProps) => {
    const { toast } = useToast()

    const organizationTypesQuery: OrganizationTypePayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
    }

    const {
        data: organizationTypes = [],
        isLoading: organizationTypesLoading,
        isError: organizationTypesError,
        isSuccess: organizationTypesSuccess,
    } = useGetAllOrganizationTypesQuery(organizationTypesQuery)

    const form = useForm({
        schema: formSchema,
        defaultValues: !organization
            ? {
                  full_name: '',
                  short_name: '',
                  register_number: '',
                  phone: '',
                  email: '',
              }
            : {
                  full_name: organization.full_name,
                  short_name: organization.short_name,
                  register_number: organization.register_number,
                  phone: organization.phone,
                  email: organization.email,
                  organization_type_id: `${organization.organization_type.organization_type_id}`,
              },
    })

    const [
        createOrganization,
        { isLoading: isAdding, isError: createError, isSuccess: createSuccess },
    ] = useCreateOrganizationMutation()

    const [
        updateOrganization,
        {
            isLoading: isUpdating,
            isError: updateError,
            isSuccess: updateSuccess,
        },
    ] = useUpdateOrganizationMutation()

    const handleSubmit = (
        data: Partial<CreateOrganizationPayloadInterface>
    ) => {
        if (organization) {
            updateOrganization({
                organization_id: organization.organization_id,
                ...data,
            })
        } else {
            createOrganization(data)
        }
    }

    useEffect(() => {
        if (createSuccess) {
            toast({
                description: `Организация успешно добавлена`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [createSuccess])

    useEffect(() => {
        if (updateSuccess) {
            toast({
                description: `Организация успешно изменена`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [updateSuccess])

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                    <InputField label="Полное название" {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="short_name"
                render={({ field }) => (
                    <InputField
                        className="mt-3"
                        label="Короткое название"
                        {...field}
                    />
                )}
            />
            <div className="flex">
                <FormField
                    control={form.control}
                    name="register_number"
                    render={({ field }) => (
                        <InputField
                            className="w-full mr-5 mt-3"
                            label="Регистрационный номер"
                            {...field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="organization_type_id"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FormLabel>Тип организации</FormLabel>
                            {organizationTypesLoading && <LoadingSpinner />}
                            {organizationTypesError && (
                                <CustomAlert message="Типы организаций не загрузились. Попробуйте позднее." />
                            )}
                            {organizationTypesSuccess &&
                                organizationTypes?.length > 0 && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите тип организации" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {organizationTypes.map(
                                                (organizationType) => (
                                                    <SelectItem
                                                        key={
                                                            organizationType.organization_type_id
                                                        }
                                                        value={String(
                                                            organizationType.organization_type_id
                                                        )}
                                                    >
                                                        {
                                                            organizationType.organization_type_name
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
            </div>
            <div className="flex">
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <InputField
                            className="w-full mr-5 mt-3"
                            label="Телефон"
                            {...field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <InputField
                            className="w-full mt-3"
                            label="Email"
                            {...field}
                            value={`${field.value}`}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
            {(createError || updateError) && <CustomAlert className="mt-3" />}
            <Fragment>
                <Button
                    className="w-[100px] mt-10 mr-4"
                    type="submit"
                    disabled={isAdding || isUpdating}
                >
                    {isAdding || isUpdating ? (
                        <LoadingSpinner />
                    ) : organization ? (
                        'Сохранить'
                    ) : (
                        'Создать'
                    )}
                </Button>
                <Button
                    className="w-[100px] mt-10"
                    type="button"
                    variant={'outline'}
                    onClick={() => setDialogOpen!(false)}
                >
                    Отменить
                </Button>
            </Fragment>
        </CustomForm>
    )
}

export default AddOrganizationForm
