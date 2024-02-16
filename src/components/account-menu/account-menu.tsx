import { Fragment, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { User } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import ChevronDown from '@/assets/icons/ChevronDown.svg'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useLogoutMutation } from '@/redux/api/auth'
import { useGetUserByIdQuery } from '@/redux/api/users'
import { JWT } from '@/types/interface/auth'
import {
    getCookieValue,
    getJWTtokens,
    removeCookieValue,
} from '@/utils/helpers'

export default function AccountMenu() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const accessToken = getCookieValue('accessToken')
    const { user_id }: JWT = accessToken
        ? jwtDecode(accessToken)
        : { user_id: -1, email: '' }

    const { data: user } = useGetUserByIdQuery(user_id)

    const [logout, { isError: isLogoutError, isSuccess: isLogoutSuccess }] =
        useLogoutMutation()

    useEffect(() => {
        if (isLogoutSuccess) {
            removeCookieValue('accessToken')
            removeCookieValue('refreshToken')
            navigate('/signin')
        }
    }, [isLogoutSuccess])

    const handleLogout = () => {
        const refreshToken = getJWTtokens().refreshToken

        if (refreshToken) {
            logout({ refresh_token: refreshToken! })
        } else {
            navigate('/signin')
        }
    }

    useErrorToast(isLogoutError, handleLogout)

    const icon = null
    return (
        <div className="flex items-center justify-center mr-5 gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer flex items-center justify-center gap-1">
                        {icon ? (
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                            </Avatar>
                        ) : (
                            <Fragment>
                                <User />
                            </Fragment>
                        )}

                        <div className="font-pop text-[14px] text-[#3F434A]">
                            <p>
                                {user?.person.last_name}{' '}
                                {user?.person.first_name}
                            </p>
                        </div>
                        <ChevronDown />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="justify-center items-center rounded-xl mt-1"
                    align="end"
                >
                    <DropdownMenuItem>
                        <Button
                            onClick={() => navigate('/settings')}
                            variant="ghost"
                            className=" h-5 w-20 justify-start p-0"
                            size="sm"
                        >
                            {t('settings')}
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-destructive h-5 w-20 justify-start p-0 hover:text-destructive"
                            size="sm"
                        >
                            {t('exit')}
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
