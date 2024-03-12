import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import AddUserForm from './add-user-form'
import { usersColumns } from './users-columns'
import ExportForm from '../tasklist/components/export-form.tsx'
import ImportForm from '../tasklist/components/import-form.tsx'
import { placeholderQuery } from '../tasklist/constants.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetUsersQuery } from '@/redux/api/users'
import { FormattedUsersInterface } from '@/types/interface/user'
import { formatInitials } from '@/utils/helpers'

export default function UsersPage() {
    const [usersQuery, setUsersQuery] = useState(placeholderQuery)
    const [exportFormOpen, setExportFormOpen] = useState(false)
    const [importFormOpen, setImportFormOpen] = useState(false)

    const {
        data: users = { count: 0, data: [] },
        error,
        isFetching,
        refetch,
    } = useGetUsersQuery(usersQuery)

    const formattedUsers: FormattedUsersInterface[] = users.data.map((row) => {
        const isPerson = row.person.person_id !== null

        return {
            user: row,
            key: row.user_id,
            user_id: row.user_id,
            FIO: isPerson
                ? formatInitials(
                      row.person.first_name,
                      row.person.last_name,
                      row.person.patronymic
                  )
                : '',
            phone: isPerson ? row.person.phone : row.organization?.phone,
            email: row.email,
            organization_name: row.organization?.short_name,
            organization_type_name:
                row.organization?.organization_type.organization_type_name,
            role_name: row.role.role_name,
            is_active: row.is_active,
        }
    })

    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <PageLayout
            title={t('users')}
            onRefreshClick={refetch}
            actionButton={
                <FormDialog
                    open={formOpen}
                    setOpen={setFormOpen}
                    addItemForm={<AddUserForm setDialogOpen={setFormOpen} />}
                />
            }
            rightBlock={
                <div>
                    <div className="h-16 " />
                    <div className="flex gap-3 mb-3">
                        <FormDialog
                            open={exportFormOpen}
                            setOpen={setExportFormOpen}
                            actionButton={<ExcelButton buttonType="export" />}
                            addItemForm={<ExportForm />}
                        />
                        <FormDialog
                            open={importFormOpen}
                            setOpen={setImportFormOpen}
                            actionButton={<ExcelButton buttonType="import" />}
                            addItemForm={<ImportForm type="users" />}
                        />
                    </div>
                </div>
            }
        >
            {error ? (
                <ErrorCustomAlert error={error} />
            ) : (
                <DataTable
                    data={formattedUsers}
                    columns={usersColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting) => {
                        const sorts = sorting.reduce((acc, value) => {
                            const currentSortOrder = value.desc ? 'DESC' : 'ASC'

                            switch (value.id) {
                                case 'FIO':
                                    return {
                                        ...acc,
                                        person: {
                                            last_name: currentSortOrder,
                                            first_name: currentSortOrder,
                                            patronymic: currentSortOrder,
                                        },
                                    }
                                case 'phone':
                                    return {
                                        ...acc,
                                        person: {
                                            [`${value.id}`]: currentSortOrder,
                                        },
                                    }
                                case 'short_name':
                                    return {
                                        ...acc,
                                        organization: {
                                            [`${value.id}`]: currentSortOrder,
                                        },
                                    }
                                case 'organization_type_name':
                                    return {
                                        ...acc,
                                        organization: {
                                            organization_type: {
                                                [`${value.id}`]:
                                                    currentSortOrder,
                                            },
                                        },
                                    }
                                case 'role_name':
                                    return {
                                        ...acc,
                                        role: {
                                            [`${value.id}`]: currentSortOrder,
                                        },
                                    }
                                default:
                                    return {
                                        ...acc,
                                        [`${value.id}`]: currentSortOrder,
                                    }
                            }
                        }, {})

                        setUsersQuery({
                            ...usersQuery,
                            sorts,
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    paginationInfo={{
                        itemCount: users.count,
                        pageSize: usersQuery.offset.count,
                    }}
                    isLoading={isFetching}
                />
            )}
        </PageLayout>
    )
}
