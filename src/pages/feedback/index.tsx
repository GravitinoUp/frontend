import { useEffect } from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import CustomForm, { useForm } from '@/components/form/form'
import ImageCarousel from '@/components/image-carousel/image-carousel'
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
import { Textarea } from '@/components/ui/textarea'
import { FEEDBACK_DEPARTMENTS, FEEDBACK_SUBJECTS } from '@/constants/constants'
import { useErrorToast } from '@/hooks/use-error-toast'
import { cn } from '@/lib/utils'
import { useCreateGuestOrderMutation } from '@/redux/api/orders'
import { GuestOrderPayloadInterface } from '@/types/interface/orders'

const formSchema = z.object({
    guest_name: z.string().min(1, i18next.t('validation.require.full.name')),
    guest_email: z
        .string()
        .email({ message: i18next.t('validation.require.email') }),
    guest_phone: z.string().optional(),
    subject: z.string(),
    department: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
})

export function FeedbackPage({ type }: { type: 'guest' | 'worker' }) {
    const { t } = useTranslation()

    const form = useForm({
        schema: formSchema,
        defaultValues: {
            guest_name: '',
            guest_email: '',
            guest_phone: '',
            subject: FEEDBACK_SUBJECTS.cleanliness,
            department: '',
            description: '',
            images: [],
        },
    })

    const [
        submitGuestForm,
        {
            error: guestSubmitError,
            isLoading: isGuestSubmitLoading,
            isSuccess: isGuestSubmitSuccess,
        },
    ] = useCreateGuestOrderMutation()

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        if (type === 'guest') {
            const guestData: GuestOrderPayloadInterface = {
                guest_name: data.guest_name,
                guest_email: data.guest_email,
                guest_phone: `${data.guest_phone}`,
                order_name: data.subject,
                order_description: `${data.description}`,
                facility_id: 1, // TODO facility from QR
            }

            submitGuestForm(guestData)
        }
    }

    useEffect(() => {
        // TODO Success
    }, [isGuestSubmitSuccess])

    useErrorToast(() => handleSubmit(form.getValues()), guestSubmitError)

    return (
        <div className="bg-gradient-to-b from-[#BDD5F226] to-[#FFFFFF] h-full select-none flex items-center justify-center">
            <CustomForm
                form={form}
                onSubmit={handleSubmit}
                className="bg-white relative w-[600px] h-full shadow-xl rounded-2xl flex place-content-center px-8"
            >
                <div className="max-w-[400px]">
                    <div className="flex flex-col items-center gap-8 mt-20 text-center">
                        <h1 className="text-3xl text-primary">
                            {t('feedback.title')}
                        </h1>
                        <p className="max-w-[300px]">
                            {t('feedback.description')}
                        </p>
                    </div>
                    <FormField
                        control={form.control}
                        name="guest_name"
                        render={({ field }) => (
                            <InputField
                                label={t('full.name')}
                                className="mt-10"
                                isRequired
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="guest_email"
                        render={({ field }) => (
                            <InputField
                                label="Email"
                                className="mt-5"
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="guest_phone"
                        render={({ field }) => (
                            <InputField
                                label={t('phone')}
                                className="mt-5"
                                {...field}
                            />
                        )}
                    />
                    {type === 'guest' && (
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>
                                        {t('feedback.subject.title')}
                                    </FormLabel>
                                    <div className="flex flex-col min-[600px]:flex-row gap-5">
                                        {Object.values(FEEDBACK_SUBJECTS).map(
                                            (subject) => (
                                                <Button
                                                    key={subject}
                                                    type="button"
                                                    className={cn(
                                                        field.value === subject
                                                            ? 'bg-[#E8E9EB]'
                                                            : 'bg-background',
                                                        'w-full py-3 rounded-xl border hover:bg-[#E8E9EB] text-[#3F434A]'
                                                    )}
                                                    onClick={() => {
                                                        field.onChange(subject)
                                                    }}
                                                >
                                                    {subject}
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}
                    {type === 'worker' && (
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>
                                        {t('feedback.department.title')}
                                    </FormLabel>
                                    <div className="flex flex-col min-[600px]:flex-row gap-5">
                                        {Object.values(
                                            FEEDBACK_DEPARTMENTS
                                        ).map((department) => (
                                            <Button
                                                key={department}
                                                type="button"
                                                className={cn(
                                                    field.value === department
                                                        ? 'bg-[#E8E9EB]'
                                                        : 'bg-background',
                                                    'w-full py-3 rounded-xl border hover:bg-[#E8E9EB] text-[#3F434A]'
                                                )}
                                                onClick={() => {
                                                    field.onChange(department)
                                                }}
                                            >
                                                {department}
                                            </Button>
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>{t('feedback.text')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[140px]"
                                        placeholder={t('placeholder.textarea')}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>
                                    {t('feedback.attach.images')},
                                    <span className="text-xs text-[#C4C4C4]">
                                        {' '}
                                        {t('feedback.attach.images.limit')}
                                    </span>
                                </FormLabel>
                                <ImageCarousel files={[]} />
                            </FormItem>
                        )}
                    />
                    <Button
                        className="w-full mt-10 rounded-xl"
                        type="submit"
                        disabled={isGuestSubmitLoading}
                    >
                        {isGuestSubmitLoading ? (
                            <LoadingSpinner />
                        ) : (
                            t('button.action.send')
                        )}
                    </Button>
                    <div className="flex flex-col items-center">
                        <p className="mt-6 text-sm text-body-light max-w-[300px] text-center">
                            {t('feedback.agree')}
                            <a href="#" className="text-primary">
                                {' '}
                                {t('feedback.agree.terms')}
                            </a>
                        </p>
                        <p className="my-6 text-[#A9A9A9] text-lg">
                            {t('feedback.made.in')}
                            <span className="font-bold"> {t('gravitino')}</span>
                        </p>
                    </div>
                </div>
            </CustomForm>
        </div>
    )
}
