import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useAuthMutation } from '@/redux/api/auth'
import { setAccessToken, setRefreshToken } from '@/redux/reducers/authSlice'

const formSchema = z.object({
    email: z.string().email(i18next.t('validation.require.email')),
    password: z.string().min(1, i18next.t('validation.require.password')),
    remember_me: z.boolean(),
})

export function SignInPage() {
    const form = useForm({
        schema: formSchema,
        defaultValues: {
            email: '',
            password: '',
            remember_me: false,
        },
    })

    const [shown, setShown] = useState(false)
    const { t } = useTranslation()

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [authUser, { data: authData, isSuccess: isSuccess, error }] =
        useAuthMutation()

    useEffect(() => {
        if (isSuccess) {
            dispatch(setAccessToken(authData?.accessToken))
            if (form.getValues().remember_me) {
                dispatch(setRefreshToken(authData?.refreshToken))
            }

            navigate('/dashboard')
        }
    }, [isSuccess])

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        authUser(data)
    }

    useEffect(() => {
        document.title = t('authorization')
    }, [])

    useErrorToast(() => handleSubmit(form.getValues()), error)

    return (
        <div className="bg-[#F8F8F8] h-screen w-screen select-none  flex items-center justify-center">
            <CustomForm
                form={form}
                onSubmit={handleSubmit}
                className="bg-white relative h-[690px] w-[600px] rounded-2xl flex place-content-center"
            >
                <div>
                    <div className="flex flex-col gap-16 mt-28">
                        <p className="text-[#0784D1] uppercase items-center font-pop font-bold text-[28px] flex justify-center">
                            {t('gravitino.full.name')}
                        </p>
                        <p className="text-[#3F434A] font-pop text-[28px] flex items-center  justify-center  ">
                            {t('authorization.title')}
                        </p>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <InputField
                                label="Email"
                                className="mt-16"
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <div className="relative justify-center">
                                <InputField
                                    label={t('authorization.password')}
                                    type={shown ? 'text' : 'password'}
                                    className="mt-3"
                                    suffixIcon={
                                        <Button
                                            type="button"
                                            variant={'ghost'}
                                            className="px-4 rounded-l-none rounded-r-xl"
                                            onClick={() => setShown(!shown)}
                                        >
                                            {shown ? (
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
                    <div className="mt-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name="remember_me"
                                    render={({ field }) => (
                                        <Checkbox
                                            label={t('authorization.remember')}
                                            id="remember"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                            <Link to="/123">
                                <p className="text-[#0784D1] font-pop font-[400] text-[15px] flex items-end  justify-end hover:underline">
                                    {t('authorization.password.forgot')}
                                </p>
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            className="rounded-xl h-[40px] w-[400px] bg-[#0784D1] mt-6"
                            variant="default"
                        >
                            {t('button.action.enter')}
                        </Button>
                    </div>
                </div>
            </CustomForm>
        </div>
    )
}
