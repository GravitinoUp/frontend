import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18next from '../../i18n.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import {
    useCreateBranchMutation,
    useUpdateBranchMutation,
} from '@/redux/api/branch'
import { BranchInterface } from '@/types/interface/branch'

const branchSchema = z.object({
    branch_name: z
        .string()
        .min(1, { message: i18next.t('validation.require.title') }),
    branch_address: z
        .string()
        .min(1, { message: i18next.t('validation.require.address') }),
})

interface AddBranchFormProps {
    branch?: BranchInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddBranchForm = ({ branch, setDialogOpen }: AddBranchFormProps) => {
    const { t } = useTranslation()

    const form = useForm({
        schema: branchSchema,
        defaultValues: !branch
            ? {
                  branch_name: '',
                  branch_address: '',
              }
            : {
                  branch_name: branch.branch_name,
                  branch_address: branch.branch_address,
              },
    })

    const [
        createBranch,
        { isLoading: isAdding, error: createError, isSuccess: createSuccess },
    ] = useCreateBranchMutation()

    const [
        updateBranch,
        { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess },
    ] = useUpdateBranchMutation()

    const createSuccessMsg = useMemo(
        () =>
            t('toast.success.description.create.m', {
                entityType: t('branch'),
            }),
        []
    )

    const updateSuccessMsg = useMemo(
        () =>
            t('toast.success.description.update.m', {
                entityType: t('branch'),
            }),
        []
    )

    useSuccessToast(createSuccessMsg, createSuccess, setDialogOpen)
    useSuccessToast(updateSuccessMsg, updateSuccess, setDialogOpen)

    function handleSubmit(data: Partial<Omit<BranchInterface, 'branch_id'>>) {
        if (!branch) {
            createBranch(data)
        } else {
            updateBranch({ branch_id: branch.branch_id, ...data })
        }
    }

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="branch_name"
                render={({ field }) => (
                    <InputField label={t('title')} {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="branch_address"
                render={({ field }) => (
                    <InputField
                        className="mt-3"
                        label={t('address')}
                        {...field}
                    />
                )}
            />
            {createError && <ErrorCustomAlert error={createError} />}
            {updateError && <ErrorCustomAlert error={updateError} />}
            <div className="h-48" />
            <Fragment>
                <Button
                    className="w-[100px] mt-10 mr-4"
                    type="submit"
                    disabled={isAdding || isUpdating}
                >
                    {isAdding || isUpdating ? (
                        <LoadingSpinner />
                    ) : branch ? (
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

export default AddBranchForm
