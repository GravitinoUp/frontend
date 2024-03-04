import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
    CustomAlert,
    ErrorCustomAlert,
} from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useSuccessToast } from '@/hooks/use-success-toast'
import { useGetAllOrderStatusesQuery } from '@/redux/api/order-statuses'
import { useUpdateStatusMutation } from '@/redux/api/orders'
import { OrderInterface } from '@/types/interface/orders'

const statusSchema = z.object({
    order_status_id: z.string(),
})

interface ChangeStatusFormProps {
    order: OrderInterface
    setDialogOpen: Dispatch<SetStateAction<boolean>>
}

const ChangeStatusForm = ({ order, setDialogOpen }: ChangeStatusFormProps) => {
    const { t } = useTranslation()

    const form = useForm({
        schema: statusSchema,
        defaultValues: {
            order_status_id: String(order.order_status.order_status_id),
        },
    })

    const {
        data: orderStatuses = [],
        isLoading: orderStatusesLoading,
        isError: orderStatusesError,
        isSuccess: orderStatusesSuccess,
    } = useGetAllOrderStatusesQuery()

    const [
        updateStatus,
        { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess },
    ] = useUpdateStatusMutation()

    function handleSubmit(data: z.infer<typeof statusSchema>) {
        updateStatus({
            order_id: order.order_id,
            order_status_id: data.order_status_id,
        })
    }

    const updateSuccessMsg = useMemo(
        () =>
            t('toast.success.description.update.f', {
                entityType: t('order'),
            }),
        []
    )

    useSuccessToast(updateSuccessMsg, updateSuccess, setDialogOpen)

    return (
        <CustomForm form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="order_status_id"
                render={({ field }) => (
                    <FormItem className="w-full mt-3">
                        <FormLabel>{t('select.status')}</FormLabel>
                        {orderStatusesLoading && <LoadingSpinner />}
                        {orderStatusesError && (
                            <CustomAlert
                                message={t('multiselect.error.status')}
                            />
                        )}
                        {orderStatusesSuccess && orderStatuses?.length > 0 && (
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={t(
                                                'multiselect.placeholder.status'
                                            )}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {orderStatuses.map((orderStatus) => (
                                        <SelectItem
                                            key={orderStatus.order_status_id}
                                            value={String(
                                                orderStatus.order_status_id
                                            )}
                                        >
                                            {orderStatus.order_status_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </FormItem>
                )}
            />
            {updateError && <ErrorCustomAlert error={updateError} />}
            <Button className="mt-8" type="submit" disabled={isUpdating}>
                {isUpdating ? <LoadingSpinner /> : t('button.action.save')}
            </Button>
        </CustomForm>
    )
}

export default ChangeStatusForm
