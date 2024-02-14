import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../hooks/reduxHooks'

export default function NotFoundPage() {
    const { isLogin } = useAppSelector((state) => state.auth)

    useEffect(() => {
        document.title = 'Страница не найдена'
    }, [])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold mb-3">Ошибка 404</div>

            <div className="row-3">
                {isLogin ? (
                    <Link className="underline" to="/dashboard">
                        На главную
                    </Link>
                ) : (
                    <Link className="underline" to="/signin">
                        На страницу входа
                    </Link>
                )}
            </div>
        </div>
    )
}