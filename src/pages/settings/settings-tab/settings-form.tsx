import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import CustomForm from '@/components/form/form.tsx'
import { InputField } from '@/components/input-field/input-field.tsx'
import { FormField } from '@/components/ui/form'
import { UserInterface } from '@/types/interface/user.ts'
import { capitalizeFirstLetter } from '@/utils/helpers.ts'

export function SettingsForm({ user }: { user: UserInterface }) {
    const lastLabel = user.group === null ? 'company' : 'job_title'

    const form = useForm({
        defaultValues: {
            FIO: `${user.person.last_name} ${user.person.first_name} ${user.person.patronymic}`,
            phone: user.person.phone || '',
            [lastLabel]:
                user.group === null
                    ? user.organization?.full_name
                    : user.group?.group_name,
        },
    })
    const { t } = useTranslation()

    return (
        <CustomForm form={form} onSubmit={() => {}}>
            <FormField
                control={form.control}
                name="FIO"
                render={({ field }) => (
                    <InputField label={t('full.name')} {...field} readOnly />
                )}
            />
            {form.watch('phone') && (
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <InputField
                            label={t('phone')}
                            className="mt-3"
                            {...field}
                            readOnly
                        />
                    )}
                />
            )}
            {form.watch(lastLabel) && (
                <FormField
                    control={form.control}
                    name={lastLabel}
                    render={({ field }) => (
                        <InputField
                            label={capitalizeFirstLetter(t(lastLabel))}
                            className="mt-3"
                            {...field}
                            readOnly
                        />
                    )}
                />
            )}
        </CustomForm>
    )
}
