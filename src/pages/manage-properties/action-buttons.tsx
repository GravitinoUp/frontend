import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@/assets/icons/delete_icon.svg'
import { Button } from '@/components/ui/button'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useDeletePropertyNameMutation } from '@/redux/api/properties'
import { PropertyInterface } from '@/types/interface/properties'

export const ActionButtons = ({
    property,
}: {
    property: PropertyInterface
}) => {
    const [deletePropertyName, { error, isSuccess }] =
        useDeletePropertyNameMutation()

    const { t } = useTranslation()

    const deleteSuccessMsg = useMemo(
        () =>
            t('toast.success.description.delete.f', {
                entityType: t('property'),
                entityName: property.property_name,
            }),
        []
    )

    const handlePropertyDelete = useCallback(() => {
        deletePropertyName(property.property_name_id)
    }, [property.property_name_id, deletePropertyName])

    useErrorToast(handlePropertyDelete, error)
    useSuccessToast(deleteSuccessMsg, isSuccess)

    return (
        <Button variant="ghost" onClick={handlePropertyDelete}>
            <DeleteIcon />
        </Button>
    )
}
