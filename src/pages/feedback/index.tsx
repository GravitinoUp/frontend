import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { z } from 'zod'
import EmailIcon from '@/assets/icons/email.svg'
import ImageIcon from '@/assets/icons/image.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import UserIcon from '@/assets/icons/user.svg'
import { FileData } from '@/components/file-container/multi-file-input'
import CustomForm, { useForm } from '@/components/form/form'
import ImageCarousel from '@/components/image-carousel/image-carousel'
import ImageCarouselButton from '@/components/image-carousel/image-carousel-button'
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
import { useSuccessToast } from '@/hooks/use-success-toast'
import { cn } from '@/lib/utils'
import {
    useCreateGuestOrderMutation,
    useUploadFileMutation,
} from '@/redux/api/orders'
import { GuestOrderPayloadInterface } from '@/types/interface/orders'

const formSchema = z.object({
    guest_name: z.string().min(1, i18next.t('validation.require.full.name')),
    guest_email: z
        .string()
        .email({ message: i18next.t('validation.require.email') }),
    guest_phone: z.string().optional(),
    subject: z.string(),
    department: z.string(),
    description: z.string().optional(),
})

export function FeedbackPage({ type }: { type: 'guest' | 'worker' }) {
    const { t } = useTranslation()
    const location = useLocation()

    const [selectedFiles, setSelectedFiles] = useState<FileData[]>([])
    const [uploadFiles, { isLoading, error, isSuccess }] =
        useUploadFileMutation()

    const form = useForm({
        schema: formSchema,
        defaultValues: {
            guest_name: '',
            guest_email: '',
            guest_phone: '',
            subject: FEEDBACK_SUBJECTS.cleanliness,
            department: FEEDBACK_DEPARTMENTS.fss,
            description: '',
        },
    })

    const [
        submitGuestForm,
        {
            data,
            error: guestSubmitError,
            isLoading: isGuestSubmitLoading,
            isSuccess: isGuestSubmitSuccess,
        },
    ] = useCreateGuestOrderMutation()

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        const facilityId = location.search
            .split('?')
            .find((row) => row.startsWith(`facility=`))
            ?.split('=')[1]

        if (type === 'guest') {
            const guestData: GuestOrderPayloadInterface = {
                guest_name: data.guest_name,
                guest_email: data.guest_email,
                guest_phone: `${data.guest_phone}`,
                order_name: data.subject,
                order_description: `${data.description}`,
                facility_id: Number(facilityId),
            }

            submitGuestForm(guestData)
        } else {
            const guestData: GuestOrderPayloadInterface = {
                guest_name: data.guest_name,
                guest_email: data.guest_email,
                guest_phone: `${data.guest_phone}`,
                order_name: data.department,
                order_description: `${data.description}`,
                facility_id: Number(facilityId),
            }

            submitGuestForm(guestData)
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)
    const readUploadedFiles = (files: File[]) => {
        const newFiles: FileData[] = []

        files.forEach((file) => {
            newFiles.push({
                id: crypto.randomUUID(),
                file: file,
            })
        })

        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            readUploadedFiles(files)
        }
    }

    const handleAddClick = () => {
        inputRef.current?.click()
    }

    useEffect(() => {
        if (isGuestSubmitSuccess) {
            const formData = new FormData()
            selectedFiles.forEach((value) => {
                formData.append('files', value.file!)
            })

            uploadFiles({
                formData,
                orderIDs: [data!.order_id],
                directory: 'orders',
            })
        }
    }, [isGuestSubmitSuccess])

    useSuccessToast('SUCCESS', isSuccess)

    useErrorToast(() => handleSubmit(form.getValues()), guestSubmitError)
    useErrorToast(undefined, error)

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
                                prefixIcon={<UserIcon />}
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
                                isRequired
                                prefixIcon={<EmailIcon />}
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
                                prefixIcon={<PhoneIcon />}
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
                                    <div className="flex flex-col min-[464px]:flex-row gap-5">
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
                                    <div className="flex flex-col min-[464px]:flex-row gap-5">
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
                    <FormItem className="mt-5 min-[464px]:w-[400px]">
                        <FormLabel>
                            {t('feedback.attach.images')},
                            <span className="text-xs text-[#C4C4C4]">
                                {' '}
                                {t('feedback.attach.images.limit')}
                            </span>
                        </FormLabel>
                        <ImageCarousel
                            files={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            suffixButton={
                                <Fragment>
                                    <input
                                        className="hidden"
                                        ref={inputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        disabled={selectedFiles.length > 9}
                                    />
                                    <ImageCarouselButton
                                        icon={<ImageIcon />}
                                        label={t('button.action.upload')}
                                        onClick={handleAddClick}
                                    />
                                </Fragment>
                            }
                        />
                    </FormItem>
                    <Button
                        className="w-full mt-10 rounded-xl"
                        type="submit"
                        disabled={isGuestSubmitLoading || isLoading}
                    >
                        {isGuestSubmitLoading || isLoading ? (
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
