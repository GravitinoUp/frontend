import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/hooks/reduxHooks.ts'

export default function NotFoundPage() {
    const { isLogin } = useAppSelector((state) => state.auth)
    const { t } = useTranslation()

    useEffect(() => {
        document.title = t('page.not.found')
    }, [])

    return (
        <div className="grid grid-rows-3 justify-center items-center">
            <div className="row-1">404 errors</div>

            <div className="row-2">NotFound</div>
            <div className="row-3">
                {isLogin ? (
                    <Link className="underline" to="/dashboard">
                        To Dashboard
                    </Link>
                ) : (
                    <Link className="underline" to="/signin">
                        To Sign In
                    </Link>
                )}
            </div>
        </div>
    )
}
