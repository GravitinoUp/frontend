import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18next from '../../i18n.ts'
import { placeholderQuery } from '../tasklist/constants.tsx'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
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
} from '@/components/ui/select.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useGetBranchesQuery } from '@/redux/api/branch.ts'
import { useGetAllCheckpointTypesQuery } from '@/redux/api/checkpoint-types.ts'
import {
    useCreateCheckpointMutation,
    useUpdateCheckpointMutation,
} from '@/redux/api/checkpoints.ts'
import { useGetNeighboringStatesQuery } from '@/redux/api/neighboring-states.ts'
import { useGetAllWorkingHoursQueryQuery } from '@/redux/api/working-hours.ts'
import { CheckpointInterface } from '@/types/interface/checkpoint.ts'

const checkpointSchema = z.object({
    checkpoint_name: z
        .string()
        .min(1, { message: i18next.t('validation.require.title') }),
    address: z
        .string()
        .min(1, { message: i18next.t('validation.require.address') }),
    branch_id: z.string().min(1, i18next.t('validation.require.select')),
    neighboring_state_id: z
        .string()
        .min(1, i18next.t('validation.require.select')),
    district: z
        .string()
        .min(1, { message: i18next.t('validation.require.district') }),
    region: z
        .string()
        .min(1, { message: i18next.t('validation.require.region') }),
    checkpoint_type_id: z
        .string()
        .min(1, i18next.t('validation.require.select')),
    //operating_mode_id: z.string(i18next.t('validation.require.select')),
    working_hours_id: z.string().min(1, i18next.t('validation.require.select')),
})

interface AddCheckpointFormProps {
    checkpoint?: CheckpointInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddCheckpointForm = ({
    checkpoint,
    setDialogOpen,
}: AddCheckpointFormProps) => {
    const { t } = useTranslation()

    const form = useForm({
        schema: checkpointSchema,
        defaultValues: !checkpoint
            ? {
                  checkpoint_name: '',
                  address: '',
                  branch_id: '',
                  neighboring_state_id: '',
                  district: '',
                  region: '',
                  checkpoint_type_id: '',
                  //operating_mode_id: '',
                  working_hours_id: '',
              }
            : {
                  ...checkpoint,
                  branch_id: `${checkpoint.branch.branch_id}`,
                  neighboring_state_id: `${checkpoint.neighboring_state?.neighboring_state_id}`,
                  checkpoint_type_id: `${checkpoint.checkpoint_type.checkpoint_type_id}`,
                  working_hours_id: `${checkpoint.working_hours?.working_hours_id}`,
                  district: `${checkpoint.district}`,
                  region: `${checkpoint.region}`,
                  //operating_mode_id: `${checkpoint.operating_mode_id}`,
              },
    })

    const {
        data: neighboringStates = [],
        isLoading: neighboringStatesLoading,
        isError: neighboringStatesError,
        isSuccess: neighboringStatesSuccess,
    } = useGetNeighboringStatesQuery()

    const {
        data: branches = [],
        isLoading: branchesLoading,
        isError: branchesError,
        isSuccess: branchesSuccess,
    } = useGetBranchesQuery(placeholderQuery, {
        selectFromResult: (result) => ({ ...result, data: result.data?.data }),
    })

    const {
        data: checkpointTypes = [],
        isLoading: checkpointTypesLoading,
        isError: checkpointTypesError,
        isSuccess: checkpointTypesSuccess,
    } = useGetAllCheckpointTypesQuery(placeholderQuery)

    const {
        data: workingHours = [],
        isLoading: workingHoursLoading,
        isError: workingHoursError,
        isSuccess: workingHoursSuccess,
    } = useGetAllWorkingHoursQueryQuery()

    const [
        createCheckpoint,
        { isLoading: isAdding, isError: createError, isSuccess: createSuccess },
    ] = useCreateCheckpointMutation()

    const [
        updateCheckpoint,
        {
            isLoading: isUpdating,
            isError: updateError,
            isSuccess: updateSuccess,
        },
    ] = useUpdateCheckpointMutation()

    const createSuccessMsg = useMemo(
        () =>
            t('toast.success.description.create.m', {
                entityType: t('checkpoint'),
            }),
        []
    )

    const updateSuccessMsg = useMemo(
        () =>
            t('toast.success.description.update.m', {
                entityType: t('checkpoint'),
            }),
        []
    )

    useSuccessToast(createSuccessMsg, createSuccess, setDialogOpen)
    useSuccessToast(updateSuccessMsg, updateSuccess, setDialogOpen)

    function handleSubmit(data: z.infer<typeof checkpointSchema>) {
        if (!checkpoint) {
            createCheckpoint({ ...data, operating_mode_id: '1' })
        } else {
            updateCheckpoint({
                checkpoint_id: checkpoint.checkpoint_id,
                ...data,
            })
        }
    }

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="checkpoint_name"
                render={({ field }) => (
                    <InputField label={t('title')} {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <InputField
                        className="mt-3"
                        label={t('address')}
                        {...field}
                    />
                )}
            />
            <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                    <InputField
                        className="mt-3"
                        label={t('district')}
                        {...field}
                    />
                )}
            />
            <div className="flex">
                <FormField
                    control={form.control}
                    name="neighboring_state_id"
                    render={({ field }) => (
                        <FormItem className="w-full mr-5 mt-3">
                            <FormLabel>{t('neighboring.state')}</FormLabel>
                            {neighboringStatesLoading && <LoadingSpinner />}
                            {neighboringStatesError && (
                                <CustomAlert
                                    message={t(
                                        'multiselect.error.neighboring.states'
                                    )}
                                />
                            )}
                            {neighboringStatesSuccess &&
                                neighboringStates?.length > 0 && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'multiselect.placeholder.neighboring.states'
                                                    )}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                                )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="branch_id"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FormLabel>{t('branch')}</FormLabel>
                            {branchesLoading && <LoadingSpinner />}
                            {branchesError && (
                                <CustomAlert
                                    message={t('multiselect.error.branch')}
                                />
                            )}
                            {branchesSuccess && branches?.length > 0 && (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'multiselect.placeholder.branch'
                                                )}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem
                                                key={branch.branch_id}
                                                value={String(branch.branch_id)}
                                            >
                                                {branch.branch_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex">
                <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                        <InputField
                            className="w-full mr-5 mt-3"
                            label={t('region')}
                            {...field}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="checkpoint_type_id"
                    render={({ field }) => (
                        <FormItem className="w-full mt-3">
                            <FormLabel>{t('type')}</FormLabel>
                            {checkpointTypesLoading && <LoadingSpinner />}
                            {checkpointTypesError && (
                                <CustomAlert
                                    message={t(
                                        'multiselect.error.checkpoint.type'
                                    )}
                                />
                            )}
                            {checkpointTypesSuccess &&
                                checkpointTypes?.length > 0 && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'multiselect.placeholder.checkpoint.type'
                                                    )}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {checkpointTypes.map(
                                                (checkpointType) => (
                                                    <SelectItem
                                                        key={
                                                            checkpointType.checkpoint_type_id
                                                        }
                                                        value={String(
                                                            checkpointType.checkpoint_type_id
                                                        )}
                                                    >
                                                        {
                                                            checkpointType.checkpoint_type_name
                                                        }
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="working_hours_id"
                render={({ field }) => (
                    <FormItem className="w-full mt-3">
                        <FormLabel>{t('working.hours')}</FormLabel>
                        {workingHoursLoading && <LoadingSpinner />}
                        {workingHoursError && (
                            <CustomAlert
                                message={t('multiselect.error.working.hours')}
                            />
                        )}
                        {workingHoursSuccess && workingHours?.length > 0 && (
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={t(
                                                'multiselect.placeholder.working.hours'
                                            )}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {workingHours.map((workingHour) => (
                                        <SelectItem
                                            key={workingHour.working_hours_id}
                                            value={String(
                                                workingHour.working_hours_id
                                            )}
                                        >
                                            {workingHour.working_hours_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </FormItem>
                )}
            />
            {(createError || updateError) && <CustomAlert className="mt-3" />}
            <Fragment>
                <Button
                    className="w-[100px] mt-10 mr-4"
                    type="submit"
                    disabled={isAdding || isUpdating}
                >
                    {isAdding || isUpdating ? (
                        <LoadingSpinner />
                    ) : checkpoint ? (
                        t('button.action.save')
                    ) : (
                        t('button.action.create')
                    )}
                </Button>
                <Button
                    className="w-[100px] mt-10"
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen!(false)}
                >
                    {t('button.action.cancel')}
                </Button>
            </Fragment>
        </CustomForm>
    )
}

export default AddCheckpointForm
