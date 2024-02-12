import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { useAuthMutation } from '@/redux/api/auth'
import { setAccessToken, setRefreshToken } from '@/redux/reducers/authSlice'

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
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

    document.title = 'Авторизация'

    const [shown, setShown] = useState(false)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [authUser, { data: authData, isSuccess: isSuccess }] =
        useAuthMutation()

    useEffect(() => {
        if (isSuccess) {
            if (form.getValues().remember_me) {
                dispatch(setRefreshToken(authData?.refreshToken))
                dispatch(setAccessToken(authData?.accessToken))
            }

            navigate('/dashboard')
        }
    }, [isSuccess])

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        authUser(data)
    }

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
                            Гравитино АСУ УПР
                        </p>
                        <p className="text-[#3F434A] font-pop text-[28px] flex items-center  justify-center  ">
                            Войдите в свой аккаунт
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
                                    label="Пароль"
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
                                            label="Запомнить меня"
                                            id="remember"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                            <Link to="/123">
                                <p className="text-[#0784D1] font-pop font-[400] text-[15px] flex items-end  justify-end hover:underline">
                                    Забыли пароль?
                                </p>
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            className="rounded-xl h-[40px] w-[400px] bg-[#0784D1] mt-6"
                            variant="default"
                        >
                            Войти
                        </Button>
                    </div>
                </div>
                <div className="mt-16 flex items-center justify-center gap-1">
                    <p className="text-[#8A9099] font-pop font-[400] text-[15px] flex items-end  justify-end ">
                        У вас нет учетной записи?
                    </p>
                    <Link to="/register">
                        <p className="text-[#0784D1] font-pop font-[400] text-[15px] flex items-end  justify-end hover:underline">
                            Зарегистрироваться
                        </p>
                    </Link>
                </div>
            </CustomForm>
        </div>
    )
}
