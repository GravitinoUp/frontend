import { useState } from 'react'

import { usersFormTab } from './user-form-tab'
import { usersColumns } from './users-columns'
import { CustomAlert } from '@/components/custom-alert/custom-alert'
import CustomTabs from '@/components/custom-tabs/custom-tabs'
import DataTable from '@/components/data-table/data-table'
import ExcelButton from '@/components/excel-button/excel-button'
import FormDialog from '@/components/form-dialog/form-dialog'
import { PageLayout } from '@/components/PageLayout'

import { LoadingSpinner } from '@/components/spinner/spinner'
import { useGetUsersQuery } from '@/redux/api/users'
import {
    FormattedUsersInterface,
    UsersPayloadInterface,
} from '@/types/interface/user'
import { formatInitials } from '@/utils/helpers'

export default function UsersPage() {
    const personalUsersQuery: UsersPayloadInterface = {
        offset: {
            count: 50,
            page: 1,
        },
        filter: {},
        sorts: {},
    }

    const {
        data: users = [],
        isError,
        isLoading,
        refetch,
    } = useGetUsersQuery(personalUsersQuery)

    const formattedUsers: FormattedUsersInterface[] = users.map((row) => {
        const IsOrganization = row.organization !== null

        return {
            user: row,
            key: row.user_id,
            id: row.user_id,
            FIO: IsOrganization
                ? formatInitials(
                      row.person.first_name,
                      row.person.last_name,
                      row.person.patronymic
                  )
                : '',
            phone: row.person.phone,
            email: row.email,
            company: row.organization.short_name,
            type: row.organization.organization_type.organization_type_name,
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
                    addItemForm={
                        <CustomTabs
                            tabs={usersFormTab()}
                            setDialogOpen={setFormOpen}
                        />
                    }
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
            />
        </PageLayout>
    )
}
