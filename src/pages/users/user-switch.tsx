import { useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { useChangeStatusUserMutation } from '@/redux/api/users'
import { UserInterface } from '@/types/interface/user'
export default function UserSwitch({ user }: { user: UserInterface }) {
    const { toast } = useToast()
    const [
        changeStatusUser,
        { isLoading: isUpdating, isSuccess: updateSuccess },
    ] = useChangeStatusUserMutation()

    useEffect(() => {
        if (updateSuccess) {
            toast({
                description: `Статус пользователя изменен`,
                duration: 1500,
            })
        }
    }, [updateSuccess])

    const updateStatus = () =>
        changeStatusUser({
            user_id: user.user_id,
            is_active: !user.is_active,
        })

    return (
        <Switch
            disabled={isUpdating}
            checked={user.is_active}
            onCheckedChange={updateStatus}
        />
    )
}
