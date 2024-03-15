import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ADMIN_ROLE_ID } from './constants/constants.ts'
import { useAppDispatch } from './hooks/reduxHooks'
import BranchesPage from './pages/branches'
import CheckpointsPage from './pages/checkpoints'
import { DashboardPage } from './pages/dashboard'
import { FeedbackPage } from './pages/feedback'
import ManagePropertiesPage from './pages/manage-properties'
import NotFoundPage from './pages/notfound/'
import OrganizationsPage from './pages/organizations'
import ReportsPage from './pages/reports'
import CheckpointReportsPage from './pages/reports/checkpoint-reports'
import OrganizationReportsPage from './pages/reports/organization-reports'
import SavedReportsPage from './pages/reports/saved-reports'
import RolesPage from './pages/roles'
import SettingsPage from './pages/settings'
import { SignInPage } from './pages/signin/page'
import TaskListPage from './pages/tasklist'
import TaskPage from './pages/tasklist/task'
import UsersPage from './pages/users'
import { useRefreshTokenMutation } from './redux/api/auth'
import { useGetPersonalPermissionsQuery } from './redux/api/permissions.ts'
import { useGetMyUserQuery } from './redux/api/users.ts'
import { setAccessToken } from './redux/reducers/authSlice'
import * as routes from './routes.ts'
import { FormattedPermissionInterface } from './types/interface/roles.ts'
import { getJWTtokens } from './utils/helpers'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'

const MapPage = lazy(() => import('./pages/map'))

function App() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const path = useLocation()

    const [
        fetchRefreshToken,
        { data: newAccessToken, isError: isError, isSuccess: isSuccess },
    ] = useRefreshTokenMutation()

    const { data: user, isSuccess: isUserSuccess } = useGetMyUserQuery()
    const { data: permissions, isSuccess: isPermissionsSuccess } =
        useGetPersonalPermissionsQuery()

    useEffect(() => {
        const { accessToken, refreshToken } = getJWTtokens()

        if (refreshToken) {
            fetchRefreshToken({ refresh_token: `${refreshToken}` })
        } else if (!accessToken) {
            if (
                path.pathname !== routes.FEEDBACK_GUEST &&
                path.pathname !== routes.FEEDBACK_WORKER
            ) {
                navigate(routes.SIGN_IN)
            }
        }
    }, [])

    useEffect(() => {
        if (isSuccess || (isPermissionsSuccess && isUserSuccess)) {
            if (isSuccess) {
                dispatch(setAccessToken(newAccessToken))
            }

            if (isPermissionsSuccess && isUserSuccess) {
                const formattedPermissions: FormattedPermissionInterface[] =
                    permissions.map((value) => ({
                        permission_name: value.permission.permission_name,
                        permission_description:
                            value.permission.permission_description,
                        permission_sku: value.permission.permission_sku,
                        rights: value.rights,
                    }))

                formattedPermissions.unshift({
                    permission_name: 'ADMIN',
                    permission_description: '',
                    permission_sku: 'admin',
                    rights: user.role.role_id === ADMIN_ROLE_ID,
                })

                localStorage.setItem(
                    'permissions',
                    JSON.stringify(formattedPermissions)
                )
            }

            if (
                path.pathname === routes.MAIN_PAGE ||
                path.pathname === routes.SIGN_IN
            ) {
                navigate(routes.DASHBOARD)
            }
        }
    }, [isSuccess, isPermissionsSuccess, isUserSuccess])

    useEffect(() => {
        if (isError) {
            navigate(routes.SIGN_IN)
        }
    }, [isError])

    useEffect(() => {
        const { accessToken, refreshToken } = getJWTtokens()

        if (!accessToken && !refreshToken) {
            navigate(routes.SIGN_IN)
        }
    }, [document.cookie])

    return (
        <div>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-screen">
                        <LoadingSpinner className="w-16 h-16 text-primary" />
                    </div>
                }
            >
                <Routes>
                    <Route path={routes.MAIN_PAGE} element={<Layout />}>
                        <Route
                            index
                            path={routes.DASHBOARD}
                            element={<DashboardPage />}
                        />
                        <Route>
                            <Route
                                path={routes.REPORTS}
                                element={<ReportsPage />}
                            />
                            <Route
                                path={routes.REPORTS_CHECKPOINTS}
                                element={<CheckpointReportsPage />}
                            />
                            <Route
                                path={routes.REPORTS_ORGANIZATIONS}
                                element={<OrganizationReportsPage />}
                            />
                            <Route
                                path={routes.REPORTS_SAVED}
                                element={<SavedReportsPage />}
                            />
                        </Route>
                        <Route path={routes.MAP} element={<MapPage />} />
                        <Route
                            path={routes.SETTINGS}
                            element={<SettingsPage />}
                        />
                        <Route>
                            <Route
                                path={routes.TASK_LIST}
                                element={<TaskListPage />}
                            />
                            <Route
                                path={routes.SINGLE_TASK}
                                element={<TaskPage />}
                            />
                        </Route>
                        <Route path={routes.USERS} element={<UsersPage />} />
                        <Route path={routes.ROLES} element={<RolesPage />} />
                        <Route
                            path={routes.ORGANIZATIONS}
                            element={<OrganizationsPage />}
                        />

                        <Route
                            path={routes.CHECKPOINTS}
                            element={<CheckpointsPage />}
                        />
                        <Route
                            path={routes.BRANCHES}
                            element={<BranchesPage />}
                        />
                        <Route
                            path={routes.MANAGE_PROPERTIES}
                            element={<ManagePropertiesPage />}
                        />
                    </Route>
                    <Route path={routes.SIGN_IN} element={<SignInPage />} />
                    <Route
                        path={routes.FEEDBACK_GUEST}
                        element={<FeedbackPage type="guest" />}
                    />
                    <Route
                        path={routes.FEEDBACK_WORKER}
                        element={<FeedbackPage type="worker" />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default App
