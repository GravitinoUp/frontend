import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { useSuccessToast } from '@/hooks/use-success-toast'
import { useChangeUserStatusMutation } from '@/redux/api/users'
import { UserInterface } from '@/types/interface/user'

export default function UserSwitch({ user }: { user: UserInterface }) {
    const { t } = useTranslation()

    const [
        changeUserStatus,
        { isLoading: isUpdating, isSuccess: updateSuccess },
    ] = useChangeUserStatusMutation()

    useSuccessToast(t('toast.success.description.update.m'), updateSuccess)

    const updateStatus = () =>
        changeUserStatus({
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
