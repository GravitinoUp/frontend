import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'
import CustomForm from '@/components/form/form.tsx'
import { InputField } from '@/components/input-field/input-field.tsx'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { useGetUserByIdQuery } from '@/redux/api/users.ts'
import { capitalizeFirstLetter, getUserId } from '@/utils/helpers.ts'

const formSchema = z.object({
    FIO: z.string(),
    job_title: z.string(),
    company: z.string(),
})

const userId = getUserId()

export function SettingsForm() {
    const { data: user } = useGetUserByIdQuery(userId)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            FIO:
                typeof user !== 'undefined' &&
                `${user.person.first_name} ${user.person.last_name} ${user.person.patronymic}`,
            job_title: '',
            company: '',
        },
    })
    const { t } = useTranslation()

    const handleSubmit = () => {
        console.log('submit')
    }

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="FIO"
                render={({ field }) => (
                    <InputField label={t('full.name')} {...field} disabled />
                )}
            />
            <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                    <InputField
                        label={t('job.title')}
                        className="mt-3"
                        {...field}
                        disabled
                    />
                )}
            />
            <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                    <InputField
                        label={capitalizeFirstLetter(t('company'))}
                        className="mt-3"
                        {...field}
                        disabled
                    />
                )}
            />
            <Button
                className="rounded-xl h-9 w-32 bg-primary font-bold mt-8"
                variant="default"
                onClick={() => {}}
            >
                {t('button.action.change')}
            </Button>
        </CustomForm>
    )
}
