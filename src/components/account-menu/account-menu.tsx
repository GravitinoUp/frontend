import { Fragment, useEffect } from 'react'
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
import { SETTINGS, SIGN_IN } from '@/routes.ts'
import { getJWTtokens, getUserId, removeCookieValue } from '@/utils/helpers'

const userId = getUserId()

export default function AccountMenu() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { data: user } = useGetUserByIdQuery(userId)

    const [logout, { error, isSuccess: isLogoutSuccess }] = useLogoutMutation()

    useEffect(() => {
        if (isLogoutSuccess) {
            removeCookieValue('accessToken')
            removeCookieValue('refreshToken')
            navigate(SIGN_IN)
        }
    }, [isLogoutSuccess])

    const handleLogout = () => {
        const refreshToken = getJWTtokens().refreshToken

        if (refreshToken) {
            logout({ refresh_token: refreshToken! })
        } else {
            navigate(SIGN_IN)
        }
    }

    useErrorToast(handleLogout, error)

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

                        {user?.person && (
                            <div className="font-pop text-[14px] text-[#3F434A]">
                                <p>
                                    {user.person.last_name}{' '}
                                    {user.person.first_name}
                                </p>
                            </div>
                        )}
                        <ChevronDown />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="justify-center items-center rounded-xl mt-1"
                    align="end"
                >
                    <DropdownMenuItem>
                        <Button
                            onClick={() => navigate(SETTINGS)}
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
