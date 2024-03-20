import { Fragment, useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import i18next from '../../i18n.ts'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form'
import { LOGIN_IMAGES } from '@/constants/constants.ts'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useAuthMutation } from '@/redux/api/auth'
import { useGetPersonalPermissionsQuery } from '@/redux/api/permissions.ts'
import { useGetMyUserQuery } from '@/redux/api/users.ts'
import { setAccessToken, setRefreshToken } from '@/redux/reducers/authSlice'
import { DASHBOARD } from '@/routes.ts'
import { setPermissions } from '@/utils/helpers.ts'

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

    const [bgImage, setBgImage] = useState('')
    const [passwordShown, setPasswordShown] = useState(false)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [
        signIn,
        { data: authData, isLoading, isSuccess: isAuthSuccess, error },
    ] = useAuthMutation()

    const {
        data: user,
        isSuccess: isUserSuccess,
        refetch: refetchUser,
    } = useGetMyUserQuery()
    const {
        data: permissions,
        isSuccess: isPermissionsSuccess,
        refetch: refetchPermissions,
    } = useGetPersonalPermissionsQuery()

    useEffect(() => {
        setBgImage(LOGIN_IMAGES[Math.floor(1 + Math.random() * 9)])
    }, [])

    useEffect(() => {
        if (isAuthSuccess) {
            dispatch(setAccessToken(authData?.accessToken))
            if (form.getValues().remember_me) {
                dispatch(setRefreshToken(authData?.refreshToken))
            }

            refetchUser()
            refetchPermissions()
        }
    }, [isAuthSuccess])

    useEffect(() => {
        if (isAuthSuccess && isPermissionsSuccess && isUserSuccess) {
            setPermissions(permissions, user)

            navigate(DASHBOARD)
        }
    }, [isAuthSuccess, isPermissionsSuccess, isUserSuccess])

    useEffect(() => {
        document.title = t('authorization')
    }, [])

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        signIn(data)
    }

    useErrorToast(() => handleSubmit(form.getValues()), error)

    return (
        <Fragment>
            <div className="absolute h-screen w-screen overflow-hidden">
                <img
                    src={bgImage}
                    draggable={false}
                    className="object-cover h-screen w-screen select-none animate-scale-infinite"
                />
            </div>
            <div className="h-screen w-screen select-none flex items-center justify-center">
                <CustomForm
                    form={form}
                    onSubmit={handleSubmit}
                    className="bg-white relative h-[690px] w-[600px] rounded-2xl flex place-content-center"
                >
                    <div>
                        <div className="flex flex-col gap-16 mt-28">
                            <p className="text-primary uppercase items-center font-pop font-bold text-[28px] flex justify-center">
                                {t('gravitino.full.name')}
                            </p>
                            <p className="text-[#3F434A] font-pop text-[28px] flex items-center justify-center">
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
                                        type={
                                            passwordShown ? 'text' : 'password'
                                        }
                                        className="mt-3 relative"
                                        suffixIcon={
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="px-4 rounded-l-none rounded-r-xl absolute right-0"
                                                onClick={() =>
                                                    setPasswordShown(
                                                        !passwordShown
                                                    )
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
                        <div className="mt-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name="remember_me"
                                        render={({ field }) => (
                                            <Checkbox
                                                label={t(
                                                    'authorization.remember'
                                                )}
                                                id="remember"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <Link to="/123">
                                    <p className="text-primary font-pop font-[400] text-[15px] flex items-end  justify-end hover:underline">
                                        {t('authorization.password.forgot')}
                                    </p>
                                </Link>
                            </div>
                            <Button
                                type="submit"
                                className="rounded-xl h-[40px] w-[400px] bg-primary mt-6"
                                variant="default"
                            >
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    t('button.action.enter')
                                )}
                            </Button>
                        </div>
                    </div>
                </CustomForm>
            </div>
        </Fragment>
    )
}
