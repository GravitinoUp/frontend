/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    useForm as useHookForm,
    UseFormProps as UseHookFormProps,
    FormProvider,
    UseFormReturn,
    FieldValues,
    SubmitHandler,
} from 'react-hook-form'
import { TypeOf, ZodSchema } from 'zod'
import { cn } from '@/lib/utils'

interface UseFormProps<T extends ZodSchema<any>>
    extends UseHookFormProps<TypeOf<T>> {
    schema: T
}

interface FormProps<T extends FieldValues = any>
    extends Omit<ComponentProps<'form'>, 'onSubmit'> {
    form: UseFormReturn<T>
    onSubmit: SubmitHandler<T>
}

export const useForm = <T extends ZodSchema<any>>({
    schema,
    ...formConfig
}: UseFormProps<T>) =>
    useHookForm({
        ...formConfig,
        resolver: zodResolver(schema),
    })

const CustomForm = <T extends FieldValues>({
    form,
    onSubmit,
    children,
    className,
    ...props
}: FormProps<T>) => (
    <FormProvider {...form}>
        <form
            className={cn("space-y-8", className)}
            onSubmit={form.handleSubmit(onSubmit)}
            {...props}
        >
            <fieldset disabled={form.formState.isSubmitting}>
                {children}
            </fieldset>
        </form>
    </FormProvider>
)

export default CustomForm
