import { useEffect } from 'react'
import DeleteIcon from '@/assets/icons/delete_icon.svg'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useDeletePropertyNameMutation } from '@/redux/api/properties'
import { PropertyInterface } from '@/types/interface/properties'

export const ActionButtons = ({
    property,
}: {
    property: PropertyInterface
}) => {
    const [deletePropertyName, { isError, isSuccess }] =
        useDeletePropertyNameMutation()

    const { toast } = useToast()

    useEffect(() => {
        if (isError) {
            toast({
                variant: 'destructive',
                title: 'Упс! Что-то пошло не так.',
                description: 'Возникла проблема с запросом',
                duration: 3000,
                action: (
                    <ToastAction
                        altText="Попробуйте еще раз"
                        onClick={() =>
                            deletePropertyName(property.property_name_id)
                        }
                    >
                        Попробуйте еще раз
                    </ToastAction>
                ),
            })
        }

        if (isSuccess) {
            toast({
                description: `Характеристика "${property.property_name}" удалена`,
                duration: 1500,
            })
        }
    }, [isError, isSuccess, toast])

    return (
        <Button
            variant="ghost"
            onClick={() => deletePropertyName(property.property_name_id)}
        >
            <DeleteIcon />
        </Button>
    )
}
