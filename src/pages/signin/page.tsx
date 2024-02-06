import { FormEvent, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { fetchAuth } from '@/redux/reducers/userSlice'

export function SignInPage() {
    const [shown, setShown] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    document.title = 'Авторизация'

    const dispatch = useAppDispatch()

    const OnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(fetchAuth({ email: email, password: password }))
    }

    return (
        <div className="bg-[#F8F8F8] h-screen w-screen select-none  flex items-center justify-center">
            <form
                onSubmit={OnSubmit}
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
                    <div className="mt-12">
                        <div className="flex flex-col">
                            <p className="text-[#8A9099] font-pop font-[400] text-[15px] flex items-start justify-start mb-2">
                                Email
                            </p>
                            <input
                                className="border-[#8A9099] border-[1px] rounded-xl h-[40px] w-[400px] focus: border-solid p-3"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.currentTarget.value)
                                }
                            />
                        </div>
                        <div className="relative items-center flex justify-end mt-7">
                            <div className="relative">
                                <p className="text-[#8A9099] font-pop font-[400] text-[15px] flex items-start justify-start mb-2">
                                    Пароль
                                </p>
                                <input
                                    className="border-[#8A9099] border-[1px] rounded-xl h-[40px] w-[400px] focus: border-solid p-3"
                                    type={shown ? 'text' : 'password'}
                                    value={password}
                                    autoComplete="on"
                                    onChange={(e) =>
                                        setPassword(e.currentTarget.value)
                                    }
                                />
                                <div
                                    className="absolute top-0 right-0 mt-6 p-4"
                                    onMouseDown={() => setShown(!shown)}
                                    onMouseUp={() => setShown(!shown)}
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mt-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Checkbox className="bg-[#0784D1]" />
                                    <p className="text-[#595F69] font-pop font-[400] select-none text- text-[15px] flex items-start  justify-start">
                                        Запомнить меня
                                    </p>
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
                </div>
                <div className="absolute bottom-0 mb-3 flex items-center justify-center gap-1">
                    <p className="text-[#8A9099] font-pop font-[400] text-[15px] flex items-end  justify-end ">
                        У вас нет учетной записи?
                    </p>
                    <Link to="/register">
                        <p className="text-[#0784D1] font-pop font-[400] text-[15px] flex items-end  justify-end hover:underline">
                            Зарегистрироваться
                        </p>
                    </Link>
                </div>
            </form>
        </div>
    )
}
