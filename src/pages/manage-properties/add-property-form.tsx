import { Dispatch, SetStateAction, useEffect } from 'react'
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
import { MultiSelect } from '@/components/ui/multi-select'
import { useToast } from '@/components/ui/use-toast'
import {
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
} from '@/redux/api/properties'
import { EntityType } from '@/types/interface/fetch'
import { PropertyInterface } from '@/types/interface/properties'

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
    property?: PropertyInterface
    entity: EntityType
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddPropertyForm = ({
    property,
    entity,
    setDialogOpen,
}: AddPropertyFormProps) => {
    const { toast } = useToast()

    const form = useForm({
        schema: propertySchema,
        defaultValues: !property
            ? {
                  property_name: '',
                  property_values: [],
                  entity_name: entity,
              }
            : {
                  property_name: property.property_name,
                  property_values: property.property_values.map(
                      (value) => value.property_value
                  ),
                  entity_name: property.entity_name,
              },
    })

    const [
        createProperty,
        { isLoading: isAdding, isError: createError, isSuccess: createSuccess },
    ] = useCreatePropertyMutation()

    const [
        updateProperty,
        {
            isLoading: isUpdating,
            isError: updateError,
            isSuccess: updateSuccess,
        },
    ] = useUpdatePropertyMutation()

    useEffect(() => {
        if (createSuccess) {
            toast({
                description: `Характеристика успешно добавлена`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [createSuccess])

    useEffect(() => {
        if (updateSuccess) {
            toast({
                description: `Характеристика успешно изменена`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [updateSuccess])

    const handleSubmit = (values: z.infer<typeof propertySchema>) => {
        if (property) {
            updateProperty(values)
        } else {
            createProperty(values)
        }
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
                                defaultOptions={field.value.map((value) => ({
                                    label: value,
                                    value: value,
                                }))}
                                onChange={(values) => {
                                    field.onChange(
                                        values.map(({ value }) => value)
                                    )
                                }}
                                placeholder="Добавьте значения"
                                options={[]}
                                showItems={false}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {(createError || updateError) && <CustomAlert className="mt-3" />}
            <Button
                className="w-[100px] mt-10 mr-4"
                type="submit"
                disabled={isAdding || isUpdating}
            >
                {isAdding || isUpdating ? (
                    <LoadingSpinner />
                ) : property ? (
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
