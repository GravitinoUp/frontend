import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import CustomForm, { useForm } from '@/components/form/form.tsx'
import { InputField } from '@/components/input-field/input-field.tsx'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import { FormField } from '@/components/ui/form.tsx'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import i18next from '@/i18n.ts'
import { useUpdateUserPasswordMutation } from '@/redux/api/users.ts'
import { DASHBOARD } from '@/routes.ts'

const formSchema = z
    .object({
        password: z.string().min(1, i18next.t('validation.require.password')),
        repeat_password: z
            .string()
            .min(1, i18next.t('validation.require.password')),
    })
    .refine((data) => data.password === data.repeat_password, {
        message: i18next.t('validation.require.password.mismatch'),
        path: ['repeat_password'],
    })

export const UpdatePasswordPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [passwordShown, setPasswordShown] = useState(false)
    const form = useForm({
        schema: formSchema,
        defaultValues: {
            password: '',
            repeat_password: '',
        },
    })

    const [
        updatePassword,
        { isLoading, error: updateError, isSuccess: updateSuccess },
    ] = useUpdateUserPasswordMutation()

    useEffect(() => {
        if (updateSuccess) {
            navigate(DASHBOARD)
        }
    }, [updateSuccess])

    const importSuccessMsg = useMemo(
        () => t('toast.success.description.password.update'),
        []
    )

    useSuccessToast(importSuccessMsg, updateSuccess)
    useErrorToast(void 0, updateError)

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        updatePassword(data.password)
    }

    return (
        <div className="h-screen w-screen select-none flex items-center justify-center">
            <CustomForm
                form={form}
                onSubmit={handleSubmit}
                className="bg-white relative w-[400px] rounded-2xl flex place-content-center"
            >
                <div className="flex flex-col gap-16 mb-10">
                    <p className="text-[#3F434A] font-pop text-[24px] text-center">
                        {t('update.password.description')}
                    </p>
                </div>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <div className="relative justify-center">
                            <InputField
                                label={t('authorization.password')}
                                type={passwordShown ? 'text' : 'password'}
                                className="mt-3 relative"
                                suffixIcon={
                                    <Button
                                        type="button"
                                        variant={'ghost'}
                                        className="px-4 rounded-l-none rounded-r-xl absolute right-0"
                                        onClick={() =>
                                            setPasswordShown(!passwordShown)
                                        }
                                    >
                                        {passwordShown ? (
                                            <Eye
                                                size={20}
                                                strokeWidth={2.4}
                                                color="#3F434A"
                                            />
                                        ) : (
                                            <EyeOff
                                                size={20}
                                                strokeWidth={2.4}
                                                color="#3F434A"
                                            />
                                        )}
                                    </Button>
                                }
                                {...field}
                            />
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="repeat_password"
                    render={({ field }) => (
                        <div className="relative justify-center">
                            <InputField
                                label={t('repeat.password')}
                                type={passwordShown ? 'text' : 'password'}
                                className="mt-3 relative"
                                suffixIcon={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="px-4 rounded-l-none rounded-r-xl absolute right-0"
                                        onClick={() =>
                                            setPasswordShown(!passwordShown)
                                        }
                                    >
                                        {passwordShown ? (
                                            <Eye
                                                size={20}
                                                strokeWidth={2.4}
                                                color="#3F434A"
                                            />
                                        ) : (
                                            <EyeOff
                                                size={20}
                                                strokeWidth={2.4}
                                                color="#3F434A"
                                            />
                                        )}
                                    </Button>
                                }
                                {...field}
                            />
                        </div>
                    )}
                />
                <Button
                    type="submit"
                    className="flex rounded-xl h-[40px] w-[160px] bg-primary mt-6 mx-auto"
                    variant="default"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        t('button.action.password.update')
                    )}
                </Button>
            </CustomForm>
        </div>
    )
}
