import { Fragment, useCallback, useMemo } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useDeleteUserMutation } from '@/redux/api/users.ts'
import { OrganizationInterface } from '@/types/interface/organizations'

export const ActionButtons = ({
    organization,
}: {
    organization: OrganizationInterface
}) => {
    const [deleteOrganization, { error, isSuccess, isLoading }] =
        useDeleteUserMutation()
    const { t } = useTranslation()

    const deleteSuccessMsg = useMemo(
        () =>
            t('toast.success.description.delete.f', {
                entityType: t('organization'),
                entityName: organization.short_name,
            }),
        []
    )

    const handleOrganizationDelete = useCallback(() => {
        deleteOrganization(organization.organization_id)
    }, [organization.organization_id, deleteOrganization])

    useErrorToast(handleOrganizationDelete, error)
    useSuccessToast(deleteSuccessMsg, isSuccess)

    return (
        <Fragment>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A9099]"
                    >
                        <span className="sr-only">
                            {t('action.dropdown.menu.open')}
                        </span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="text-[#FF6B6B]"
                        onClick={handleOrganizationDelete}
                        disabled={isLoading}
                    >
                        {t('action.dropdown.delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
