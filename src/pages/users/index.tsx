import { useState } from 'react'

import AddUserForm from './add-user-form'
import { usersColumns } from './users-columns'
import { placeholderQuery } from '../tasklist/constants'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'

import { LoadingSpinner } from '@/components/spinner/spinner'
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
        const isPerson = row.person.first_name !== null

        return {
            user: row,
            key: row.user_id,
            id: row.user_id,
            FIO: isPerson
                ? formatInitials(
                      row.person.first_name,
                      row.person.last_name,
                      row.person.patronymic
                  )
                : '',
            phone: isPerson ? row.person.phone : row.organization?.phone,
            email: row.email,
            company: row.organization?.short_name,
            type: row.organization?.organization_type.organization_type_name,
            role: row.role.role_name,
            is_active: row.is_active,
        }
    })

    const [formOpen, setFormOpen] = useState(false)
    return (
        <PageLayout
            title="Пользователи"
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
            {isLoading && <LoadingSpinner />}
            {isError && <CustomAlert />}
            <DataTable
                data={formattedUsers}
                columns={usersColumns}
                hasBackground
                getPaginationInfo={(pageSize, pageIndex) => {
                    setUsersQuery({
                        ...usersQuery,
                        offset: { count: pageSize, page: pageIndex + 1 },
                    })
                }}
                paginationInfo={{
                    itemCount: users.count,
                    pageSize: usersQuery.offset.count,
                }}
            />
        </PageLayout>
    )
}
