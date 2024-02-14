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
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { fetchLogout } from '@/redux/reducers/userSlice'

export default function AccountMenu() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { user } = useAppSelector((state) => state.auth)

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
                            <>
                                <User />
                            </>
                        )}
                        {user?.person && (
                            <div className="font-pop text-[14px] text-[#3F434A]">
                                {`${user?.person.last_name} ${user?.person.first_name}`}
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
                            onClick={() => {
                                dispatch(fetchLogout())
                            }}
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
