import { Fragment, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useDeletePropertyNameMutation } from '@/redux/api/properties'
import { PropertyInterface } from '@/types/interface/properties'

export const ActionButtons = ({
    property,
}: {
    property: PropertyInterface
}) => {
    const [deletePropertyName, { isError, isSuccess, isLoading }] =
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
        <Fragment>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A9099]"
                    >
                        <span className="sr-only">Открыть меню</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="text-[#FF6B6B]"
                        onClick={() =>
                            deletePropertyName(property.property_name_id)
                        }
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаляем...' : 'Удалить'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
