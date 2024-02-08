import { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'
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
import { MultiSelect } from '@/components/ui/multi-select'
import {
    useCreatePropertyNameMutation,
    useUpdatePropertyNameMutation,
} from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'
import { PropertyNameInterface } from '@/types/interface/properties'

const propertySchema = z.object({
    property_name: z
        .string()
        .min(1, { message: 'Небходимо добавить название' }),
    property_values: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: 'Нужно добавить хотя бы одно значение',
        }),
    entity_name: z.string(),
})

interface AddPropertyFormProps {
    propertyName?: PropertyNameInterface
    entity: EntityType
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddPropertyForm = ({
    propertyName,
    entity,
    setDialogOpen,
}: AddPropertyFormProps) => {
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
    ] = useCreatePropertyNameMutation()

    const [
        updateProperty,
        {
            isLoading: isUpdating,
            isError: updateError,
            isSuccess: updateSuccess,
        },
    ] = useUpdatePropertyNameMutation()

    const handleSubmit = (values: z.infer<typeof propertySchema>) => {
        createProperty(values)
    }

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="property_name"
                render={({ field }) => (
                    <InputField label="Название" {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="property_values"
                render={({ field }) => (
                    <FormItem className="mt-3">
                        <FormLabel>Значения</FormLabel>
                        <FormControl>
                            <MultiSelect
                                onChange={(values) => {
                                    field.onChange(
                                        values.map(({ value }) => value)
                                    )
                                }}
                                placeholder="Добавьте значения"
                                options={field.value.map((v) => ({
                                    value: v,
                                    label: v,
                                }))}
                                showItems={false}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button
                className="w-[100px] mt-10 mr-4"
                type="submit"
                disabled={isAdding || isUpdating}
            >
                {isAdding || isUpdating ? (
                    <LoadingSpinner />
                ) : propertyName ? (
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
        </CustomForm>
    )
}

export default AddPropertyForm
