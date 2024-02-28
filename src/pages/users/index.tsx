import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import AddUserForm from './add-user-form'
import { usersColumns } from './users-columns'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'
import { useGetUsersQuery } from '@/redux/api/users'
import { FormattedUsersInterface } from '@/types/interface/user'
import { formatInitials } from '@/utils/helpers'

export default function UsersPage() {
    const [usersQuery, setUsersQuery] = useState(placeholderQuery)

    const {
        data: users = { count: 0, data: [] },
        isError,
        isLoading,
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
                        <ExcelButton buttonType="export" onClick={() => {}} />
                        <ExcelButton buttonType="import" onClick={() => {}} />
                    </div>
                </div>
            }
        >
            {isError ? (
                <CustomAlert />
            ) : (
                <DataTable
                    data={formattedUsers}
                    columns={usersColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting) => {
                        let sorts = {}
                        sorting.forEach((value) => {
                            const desc = value.desc ? 'DESC' : 'ASC'

                            switch (value.id) {
                                case 'FIO':
                                    sorts = {
                                        ...sorts,
                                        person: {
                                            last_name: desc,
                                            first_name: desc,
                                            patronymic: desc,
                                        },
                                    }
                                    break
                                case 'phone':
                                    sorts = {
                                        ...sorts,
                                        person: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                case 'short_name':
                                    sorts = {
                                        ...sorts,
                                        organization: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                case 'organization_type_name':
                                    sorts = {
                                        ...sorts,
                                        organization: {
                                            organization_type: {
                                                [`${value.id}`]: desc,
                                            },
                                        },
                                    }
                                    break
                                case 'role_name':
                                    sorts = {
                                        ...sorts,
                                        role: {
                                            [`${value.id}`]: desc,
                                        },
                                    }
                                    break
                                default:
                                    sorts = {
                                        ...sorts,
                                        [`${value.id}`]: desc,
                                    }
                                    break
                            }
                        })

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
                    isLoading={isLoading}
                />
            )}
        </PageLayout>
    )
}
