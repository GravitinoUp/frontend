import { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import AddUserForm from './add-user-form'
import UserFiltersForm from './user-filters-form.tsx'
import { usersColumns } from './users-columns'
import ExportForm from '../../components/form/export-form.tsx'
import ImportForm from '../../components/form/import-form.tsx'
import { placeholderQuery } from '../tasklist/constants.ts'
import { ErrorCustomAlert } from '@/components/custom-alert/custom-alert'
import DataTable from '@/components/data-table/data-table'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import ExcelButton from '@/components/excel-button/excel-button'
import { PageLayout } from '@/components/PageLayout'
import { PermissionEnum } from '@/constants/permissions.enum.ts'
import { useGetUsersQuery } from '@/redux/api/users'
import {
    FormattedUsersInterface,
    UsersPayloadInterface,
} from '@/types/interface/user'
import { formatInitials, formatStringFilter } from '@/utils/helpers'

export default function UsersPage() {
    const [usersQuery, setUsersQuery] =
        useState<UsersPayloadInterface>(placeholderQuery)
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
    const [filterFormOpen, setFilterFormOpen] = useState(false)

    const { t } = useTranslation()

    if (error) {
        return <ErrorCustomAlert error={error} />
    }

    return (
        <Fragment>
            <DialogWindow
                open={filterFormOpen}
                setOpen={setFilterFormOpen}
                trigger={null}
                size="lg"
                header={
                    <h2 className="text-3xl font-semibold text-black">
                        {t('extended.search')}
                    </h2>
                }
                content={
                    <UserFiltersForm
                        handleSubmit={(data) => {
                            setUsersQuery({
                                ...usersQuery,
                                filter: {
                                    ...usersQuery.filter,
                                    person: {
                                        last_name: formatStringFilter(
                                            data.last_name
                                        ),
                                        first_name: formatStringFilter(
                                            data.first_name
                                        ),
                                        patronymic: formatStringFilter(
                                            data.patronymic
                                        ),
                                        phone: formatStringFilter(data.phone),
                                    },
                                    email: formatStringFilter(data.email),
                                    organization: {
                                        organization_id:
                                            data.organization_id !== 0
                                                ? data.organization_id
                                                : undefined,
                                    },
                                    role: {
                                        role_id:
                                            data.role_id !== 0
                                                ? data.role_id
                                                : undefined,
                                    },
                                    is_active:
                                        data.status !== null
                                            ? data.status
                                            : undefined,
                                },
                            })

                            setFilterFormOpen(false)
                        }}
                        data={{
                            last_name: usersQuery.filter.person?.last_name,
                            first_name: usersQuery.filter.person?.first_name,
                            patronymic: usersQuery.filter.person?.patronymic,
                            organization_id:
                                usersQuery.filter.organization?.organization_id,
                            role_id: usersQuery.filter.role?.role_id,
                            email: usersQuery.filter.email,
                            phone: usersQuery.filter.person?.phone,
                            status: usersQuery.filter.is_active,
                        }}
                    />
                }
            />
            <PageLayout
                title={t('users')}
                onRefreshClick={refetch}
                isLoading={isFetching}
                actionButton={
                    <DialogWindow
                        open={formOpen}
                        setOpen={setFormOpen}
                        content={<AddUserForm setDialogOpen={setFormOpen} />}
                    />
                }
                actionButtonPermissions={[PermissionEnum.UserCreate]}
                rightBlock={
                    <div>
                        <div className="h-16 " />
                        <div className="flex gap-3 mb-3">
                            <DialogWindow
                                open={exportFormOpen}
                                setOpen={setExportFormOpen}
                                trigger={<ExcelButton buttonType="export" />}
                                content={<ExportForm />}
                            />
                            <DialogWindow
                                open={importFormOpen}
                                setOpen={setImportFormOpen}
                                trigger={<ExcelButton buttonType="import" />}
                                triggerPermissions={[PermissionEnum.UserCreate]}
                                content={<ImportForm type="users" />}
                            />
                        </div>
                    </div>
                }
            >
                <DataTable
                    data={formattedUsers}
                    columns={usersColumns}
                    hasBackground
                    getTableInfo={(pageSize, pageIndex, sorting, filter) => {
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
                            filter: {
                                ...usersQuery.filter,
                                person: filter
                                    ? { last_name: filter }
                                    : undefined,
                            },
                            offset: { count: pageSize, page: pageIndex + 1 },
                        })
                    }}
                    searchSuffixIconClick={() => setFilterFormOpen(true)}
                    searchPlaceholder={t('search.last.name')}
                    paginationInfo={{
                        itemCount: users.count,
                        pageSize: usersQuery.offset.count,
                        pageIndex: usersQuery.offset.page - 1,
                    }}
                    isLoading={isFetching}
                />
            </PageLayout>
        </Fragment>
    )
}
