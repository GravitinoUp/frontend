import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18next from '../../i18n.ts'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useCreatePropertyMutation } from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'

const propertySchema = z.object({
    property_name: z.string().min(1, { message: i18next.t('validation.require.title') }),
    property_values: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: i18next.t('validation.require.select.add'),
    }),
    entity_name: z.string(),
})

interface AddPropertyFormProps {
    entity: EntityType
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddPropertyForm = ({ entity, setDialogOpen }: AddPropertyFormProps) => {
    const { t } = useTranslation()

    const form = useForm({
        schema: propertySchema,
        defaultValues: {
            property_name: '',
            property_values: [],
            entity_name: entity,
        },
    })

    const [
        createProperty,
        { isLoading: isAdding, isError: createError, isSuccess: createSuccess },
    ] = useCreatePropertyMutation()

    const createSuccessMsg = useMemo(() => t('toast.success.description.create.f', {
        entityType: t('property'),
    }), [])

    useSuccessToast(createSuccessMsg, createSuccess, setDialogOpen)

    const handleSubmit = (values: z.infer<typeof propertySchema>) => {
        createProperty({
            ...values,
            entity_name: values.entity_name as EntityType,
        })
    }

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="property_name"
                render={({ field }) => (
                    <InputField label={t('title')} {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="property_values"
                render={({ field }) => (
                    <FormItem className="mt-3">
                        <FormLabel>{t('values')}</FormLabel>
                        <FormControl>
                            <MultiSelect
                                defaultOptions={field.value.map((value) => ({
                                    label: value,
                                    value: value,
                                }))}
                                onChange={(values) => {
                                    field.onChange(
                                        values.map(({ value }) => value),
                                    )
                                }}
                                placeholder={t('multiselect.placeholder.values')}
                                options={[]}
                                showItems={false}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {createError && <CustomAlert className="mt-3" />}
            <Button
                className="w-[100px] mt-10 mr-4"
                type="submit"
                disabled={isAdding}
            >
                {isAdding ? <LoadingSpinner /> : t('button.action.create')}
            </Button>
            <Button
                className="w-[100px] mt-10"
                type="button"
                variant="outline"
                onClick={() => setDialogOpen!(false)}
            >
                {t('button.action.cancel')}
            </Button>
        </CustomForm>
    )
}

export default AddPropertyForm
