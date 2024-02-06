import { Dispatch, Fragment, SetStateAction, useEffect } from 'react'
import { z } from 'zod'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import {
    useCreateBranchMutation,
    useUpdateBranchMutation,
} from '@/redux/api/branch'
import { BranchInterface } from '@/types/interface/branch'

const branchSchema = z.object({
    branch_name: z.string().min(1, { message: 'Необходимо добавить название' }),
    branch_address: z.string().min(1, { message: 'Необходимо добавить адрес' }),
})

interface AddBranchFormProps {
    branch?: BranchInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddBranchForm = ({ branch, setDialogOpen }: AddBranchFormProps) => {
    const { toast } = useToast()

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
        { isLoading: isAdding, isError: createError, isSuccess: createSuccess },
    ] = useCreateBranchMutation()

    const [
        updateBranch,
        {
            isLoading: isUpdating,
            isError: updateError,
            isSuccess: updateSuccess,
        },
    ] = useUpdateBranchMutation()

    useEffect(() => {
        if (createSuccess) {
            toast({
                description: `Филиал успешно добавлен`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [createSuccess])

    useEffect(() => {
        if (updateSuccess) {
            toast({
                description: `Филиал успешно изменен`,
                duration: 1500,
            })
            setDialogOpen?.(false)
        }
    }, [updateSuccess])

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
                    <InputField label="Название" {...field} />
                )}
            />
            <FormField
                control={form.control}
                name="branch_address"
                render={({ field }) => (
                    <InputField className="mt-3" label="Адрес" {...field} />
                )}
            />
            {(createError || updateError) && <CustomAlert className="mt-3" />}
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
                        'Сохранить'
                    ) : (
                        'Создать'
                    )}
                </Button>
                <Button
                    className="w-[100px] mt-10"
                    type="button"
                    variant={'outline'}
                    onClick={() => setDialogOpen!(false)}
                >
                    Отменить
                </Button>
            </Fragment>
        </CustomForm>
    )
}

export default AddBranchForm
