import { lazy, Suspense, useContext, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { defaultQuery } from './constants/constants.ts'
import { TasksFilterQueryContext } from './context/tasks/tasks-filter-query.tsx'
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
import TaskListPage from './pages/tasklist'
import TaskPage from './pages/tasklist/task'
import UsersPage from './pages/users'
import { useRefreshTokenMutation } from './redux/api/auth'
import { useGetPersonalPermissionsQuery } from './redux/api/permissions.ts'
import { useGetMyUserQuery } from './redux/api/users.ts'
import { setAccessToken } from './redux/reducers/authSlice'
import * as routes from './routes.ts'
import { UPDATE_PASSWORD } from './routes.ts'
import {
    getCurrentColorScheme,
    getJWTtokens,
    setPermissions,
} from './utils/helpers'
import MapSkeleton from '@/pages/map/map-skeleton.tsx'
import { SignInPage, UpdatePasswordPage } from '@/pages/signin'

const MapPage = lazy(() => import('./pages/map'))

function App() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const path = useLocation()

    const { personalOrdersQuery, setPersonalOrdersQuery } = useContext(
        TasksFilterQueryContext
    )

    const [
        fetchRefreshToken,
        {
            data: newAccessToken,
            isError: refreshTokenError,
            isSuccess: refreshTokenSuccess,
        },
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

        setPersonalOrdersQuery({
            ...personalOrdersQuery,
            offset: defaultQuery.offset,
        })
    }, [])

    useEffect(() => {
        if (refreshTokenSuccess || (isPermissionsSuccess && isUserSuccess)) {
            if (refreshTokenSuccess) {
                dispatch(setAccessToken(newAccessToken))
            }

            if (isPermissionsSuccess && isUserSuccess) {
                setPermissions(permissions, user)
            }

            if (
                path.pathname === routes.MAIN_PAGE ||
                path.pathname === routes.SIGN_IN
            ) {
                navigate(routes.DASHBOARD)
            }
        }
    }, [refreshTokenSuccess, isPermissionsSuccess, isUserSuccess])

    useEffect(() => {
        if (refreshTokenError) {
            navigate(routes.SIGN_IN)
        }
    }, [refreshTokenError])

    useEffect(() => {
        const { accessToken, refreshToken } = getJWTtokens()

        if (
            !accessToken &&
            !refreshToken &&
            path.pathname !== routes.FEEDBACK_GUEST &&
            path.pathname !== routes.FEEDBACK_WORKER
        ) {
            navigate(routes.SIGN_IN)
        }
    }, [document.cookie])

    useEffect(() => {
        const colorScheme = getCurrentColorScheme()
        document
            .querySelector('html')
            ?.setAttribute('data-color-scheme', colorScheme)
    }, [])

    useEffect(() => {
        if (user?.is_default_password) {
            navigate(UPDATE_PASSWORD)
        }
    }, [user])

    return (
        <div>
            <Suspense fallback={<MapSkeleton />}>
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
                        path={routes.UPDATE_PASSWORD}
                        element={<UpdatePasswordPage />}
                    />
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
