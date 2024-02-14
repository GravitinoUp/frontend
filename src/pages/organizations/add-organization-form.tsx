import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18next from '../../i18n.ts'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useGetAllOrganizationTypesQuery } from '@/redux/api/organization-types'
import { useCreateOrganizationMutation, useUpdateOrganizationMutation } from '@/redux/api/organizations'
import {
    CreateOrganizationPayloadInterface,
    OrganizationInterface,
    OrganizationTypePayloadInterface,
} from '@/types/interface/organizations'

const formSchema = z.object({
    full_name: z.string().min(1, { message: i18next.t('validation.require.title') }),
    short_name: z.string().min(1, { message: i18next.t('validation.require.short.name') }),
    register_number: z.string().refine((value) => /^\d+$/.test(value), {
        message: i18next.t('validation.require.reg.number'),
    }),
    phone: z.string().refine((value) => /^\d{11}$/.test(value), {
        message: i18next.t('validation.require.phone'),
    }),
    email: z.string().nullable(),
    organization_type_id: z.string({
        required_error: i18next.t('validation.require.organization.type'),
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
        data: Partial<CreateOrganizationPayloadInterface>,
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

    const { t } = useTranslation()

    const createSuccessMsg = useMemo(() => t('toast.success.description.create.f', {
        entityType: t('organization'),
    }), [])

    const updateSuccessMsg = useMemo(() => t('toast.success.description.update.f', {
        entityType: t('organization'),
    }), [])

    useSuccessToast(createSuccessMsg, createSuccess, setDialogOpen)
    useSuccessToast(updateSuccessMsg, updateSuccess, setDialogOpen)

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                    <InputField label={t('full.title')} {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="short_name"
                render={({ field }) => (
                    <InputField
                        className="mt-3"
                        label={t('short.title')}
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
                            label={t('registration.number')}
                            {...field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="organization_type_id"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FormLabel>{t('organization.type')}</FormLabel>
                            {organizationTypesLoading && <LoadingSpinner />}
                            {organizationTypesError && (
                                <CustomAlert message={t('multiselect.error.organization.types')} />
                            )}
                            {organizationTypesSuccess &&
                                organizationTypes?.length > 0 && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t(
                                                    'multiselect.placeholder.organization.type')} />
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
                                                            organizationType.organization_type_id,
                                                        )}
                                                    >
                                                        {
                                                            organizationType.organization_type_name
                                                        }
                                                    </SelectItem>
                                                ),
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
                            label={t('phone')}
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
                        t('button.action.save')
                    ) : (
                        t('button.action.create')
                    )}
                </Button>
                <Button
                    className="w-[100px] mt-10"
                    type="button"
                    variant={'outline'}
                    onClick={() => setDialogOpen!(false)}
                >
                    {t('button.action.cancel')}
                </Button>
            </Fragment>
        </CustomForm>
    )
}

export default AddOrganizationForm
