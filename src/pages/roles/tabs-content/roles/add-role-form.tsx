import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
    CustomAlert,
    ErrorCustomAlert,
} from '@/components/custom-alert/custom-alert'
import CustomForm, { useForm } from '@/components/form/form'
import { InputField } from '@/components/input-field/input-field'
import { LoadingSpinner } from '@/components/spinner/spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useGetAllPermissionsQuery } from '@/redux/api/permissions'
import { useAddRoleMutation, useUpdateRoleMutation } from '@/redux/api/roles'
import { RoleInterface } from '@/types/interface/roles'

const formSchema = z.object({
    role_name: z.string(),
    permissions: z.array(z.number()),
})

interface AddRoleFormProps {
    role?: RoleInterface
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

const AddRoleForm = ({ role, setDialogOpen }: AddRoleFormProps) => {
    const form = useForm({
        schema: formSchema,
        defaultValues: !role
            ? { role_name: '', permissions: [] }
            : { role_name: role.role_name, permissions: [] },
    })
    const {
        data: permissions = [],
        isError: permissionsError,
        isLoading: permissionsLoading,
        isSuccess: permissionsSuccess,
    } = useGetAllPermissionsQuery()

    const [
        addRole,
        { isLoading: isAdding, error: addError, isSuccess: addSuccess },
    ] = useAddRoleMutation()

    const [
        updateRole,
        { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess },
    ] = useUpdateRoleMutation()

    const [searchQuery, setSearchQuery] = useState('')
    const { t } = useTranslation()
    const filteredPermissions = permissions.filter(({ permission_name }) =>
        permission_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = (data: { role_name: string }) => {
        if (role) {
            updateRole({ role_id: role.role_id, ...data })
        } else {
            addRole(data)
        }
    }

    const addSuccessMsg = useMemo(
        () =>
            t('toast.success.description.create.f', {
                entityType: t('role'),
            }),
        []
    )

    const updateSuccessMsg = useMemo(
        () =>
            t('toast.success.description.update.f', {
                entityType: t('role'),
            }),
        []
    )

    useSuccessToast(addSuccessMsg, addSuccess, setDialogOpen)
    useSuccessToast(updateSuccessMsg, updateSuccess, setDialogOpen)

    return (
        <CustomForm className="mt-3" form={form} onSubmit={handleSubmit}>
            <FormField
                control={form.control}
                name="role_name"
                render={({ field }) => (
                    <InputField
                        label={t('title')}
                        {...field}
                        disabled={isAdding || isUpdating}
                        required
                    />
                )}
            />
            <FormField
                control={form.control}
                name="permissions"
                render={() => (
                    <FormItem className="mt-4">
                        <FormLabel>{t('permissions')}</FormLabel>
                        {permissionsLoading && <LoadingSpinner />}
                        {permissionsError && (
                            <CustomAlert
                                message={t('multiselect.error.permissions')}
                            />
                        )}
                        {permissionsSuccess && permissions.length > 0 && (
                            <ScrollArea className="h-[445px] w-full rounded-md border px-4 py-4">
                                <InputField
                                    className="mb-5"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder={t('placeholder.search')}
                                    disabled={isAdding || isUpdating}
                                />
                                {filteredPermissions.map(
                                    ({
                                        permission_id: id,
                                        permission_name: label,
                                    }) => (
                                        <FormField
                                            key={id}
                                            control={form.control}
                                            name="permissions"
                                            render={({ field }) => (
                                                <FormItem
                                                    key={id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value.includes(
                                                                id
                                                            )}
                                                            disabled={
                                                                isAdding ||
                                                                isUpdating ||
                                                                permissionsLoading
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) => {
                                                                const permissions =
                                                                    checked
                                                                        ? [
                                                                              ...field.value,
                                                                              id,
                                                                          ]
                                                                        : field.value.filter(
                                                                              (
                                                                                  value
                                                                              ) =>
                                                                                  value !==
                                                                                  id
                                                                          )
                                                                form.setValue(
                                                                    'permissions',
                                                                    permissions
                                                                )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">
                                                        {label}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    )
                                )}
                            </ScrollArea>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
            {addError && <ErrorCustomAlert error={addError} />}
            {updateError && <ErrorCustomAlert error={updateError} />}
            <Button
                className="mt-10 mr-4"
                type="submit"
                disabled={isAdding || isUpdating}
            >
                {isAdding || isUpdating ? (
                    <LoadingSpinner />
                ) : !role ? (
                    t('button.action.create')
                ) : (
                    t('button.action.save')
                )}
            </Button>
        </CustomForm>
    )
}

export default AddRoleForm
