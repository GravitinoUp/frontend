import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetFacilitiesQuery } from '@/redux/api/facility'
import { useGetNeighboringStatesQuery } from '@/redux/api/neighboring-states'

const filterSchema = z.object({
    neighboring_state_id: z.number().optional(),
    facility_id: z.number().optional(),
})

interface ReportFiltersFormProps {
    handleSubmit: (values: z.infer<typeof filterSchema>) => void
    data?: z.infer<typeof filterSchema>
}

const ReportFiltersForm = ({ handleSubmit, data }: ReportFiltersFormProps) => {
    const { t } = useTranslation()

    const form = useForm({
        schema: filterSchema,
        defaultValues: data,
    })

    const {
        data: neighboringStates = [],
        isLoading: neighboringStatesLoading,
        isError: neighboringStatesError,
        isSuccess: neighboringStatesSuccess,
    } = useGetNeighboringStatesQuery()

    const {
        data: facilities = [],
        isLoading: facilitiesLoading,
        isError: facilitiesError,
        isSuccess: facilitiesSuccess,
    } = useGetFacilitiesQuery(placeholderQuery)

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            {form.getValues().neighboring_state_id !== -1 && (
                <FormField
                    control={form.control}
                    name="neighboring_state_id"
                    render={({ field }) => (
                        <Fragment>
                            <FormItem className="flex items-center">
                                <FormLabel className="text-xl w-full">
                                    {t('neighboring.state')}
                                </FormLabel>
                                {neighboringStatesLoading && (
                                    <Skeleton className="w-full h-10" />
                                )}
                                {neighboringStatesError && (
                                    <CustomAlert
                                        message={t(
                                            'multiselect.error.neighboring.states'
                                        )}
                                    />
                                )}
                                {neighboringStatesSuccess &&
                                    neighboringStates?.length > 0 && (
                                        <FormControl>
                                            <Select
                                                value={
                                                    field.value &&
                                                    field.value !== 0
                                                        ? String(field.value)
                                                        : 'all'
                                                }
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        value !== 'all'
                                                            ? Number(value)
                                                            : undefined
                                                    )
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        {t('all')}
                                                    </SelectItem>
                                                    {neighboringStates.map(
                                                        (neighboringState) => (
                                                            <SelectItem
                                                                key={
                                                                    neighboringState.neighboring_state_id
                                                                }
                                                                value={String(
                                                                    neighboringState.neighboring_state_id
                                                                )}
                                                            >
                                                                {
                                                                    neighboringState.neighboring_state_name
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    )}
                            </FormItem>
                            <FormMessage />
                        </Fragment>
                    )}
                />
            )}
            {form.getValues().facility_id !== -1 && (
                <FormField
                    control={form.control}
                    name="facility_id"
                    render={({ field }) => (
                        <Fragment>
                            <FormItem className="flex items-center mt-8">
                                <FormLabel className="text-xl w-full">
                                    {t('facility')}
                                </FormLabel>
                                {facilitiesLoading && <LoadingSpinner />}
                                {facilitiesError && (
                                    <CustomAlert
                                        message={t(
                                            'multiselect.error.facility'
                                        )}
                                    />
                                )}
                                {facilitiesSuccess &&
                                    facilities?.length > 0 && (
                                        <FormControl>
                                            <Select
                                                value={
                                                    field.value &&
                                                    field.value !== 0
                                                        ? String(field.value)
                                                        : 'all'
                                                }
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        value !== 'all'
                                                            ? Number(value)
                                                            : undefined
                                                    )
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        {t('all')}
                                                    </SelectItem>
                                                    {facilities.map(
                                                        (facility) => (
                                                            <SelectItem
                                                                key={
                                                                    facility.facility_id
                                                                }
                                                                value={String(
                                                                    facility.facility_id
                                                                )}
                                                            >
                                                                {
                                                                    facility.facility_name
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    )}
                            </FormItem>
                            <FormMessage />
                        </Fragment>
                    )}
                />
            )}
            <Button className="w-[200px] mt-10 mr-4" type="submit">
                {t('button.action.apply')}
            </Button>
            <Button
                className="w-[200px] mt-10"
                type="button"
                variant="outline"
                onClick={() => {
                    form.reset({
                        neighboring_state_id: 0,
                        facility_id: 0,
                    })
                }}
            >
                {t('button.action.reset')}
            </Button>
        </CustomForm>
    )
}

export default ReportFiltersForm
