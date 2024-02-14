import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useAppDispatch } from './hooks/reduxHooks'
import BranchesPage from './pages/branches'
import CheckpointsPage from './pages/checkpoints'
import { DashboardPage } from './pages/dashboard/page'
import ManagePropertiesPage from './pages/manage-properties'
import MediaReportsPage from './pages/mediareports/page'
import NotFoundPage from './pages/notfound/'
import OrganizationsPage from './pages/organizations'
import { RegisterPage } from './pages/register/page'
import ReportsPage from './pages/reports/page'
import RolesPage from './pages/roles'
import SettingsPage from './pages/settings'
import { SignInPage } from './pages/signin/page'
import TaskListPage from './pages/tasklist'
import TaskPage from './pages/tasklist/task'
import UsersPage from './pages/users'
import { useRefreshTokenMutation } from './redux/api/auth'
import { setAccessToken } from './redux/reducers/authSlice'
import { getCookieValue } from './utils/helpers'

function App() {
    const [loading, setLoading] = useState<boolean | null>(null)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const path = useLocation()

    const [
        fetchRefreshToken,
        { data: newAccessToken, isError: isError, isSuccess: isSuccess },
    ] = useRefreshTokenMutation()

    useEffect(() => {
        if (loading === null) {
            const accessToken = getCookieValue('accessToken')
            const refreshToken = getCookieValue('refreshToken')

            if (refreshToken) {
                fetchRefreshToken({ refresh_token: `${refreshToken}` })
                setLoading(true)
            } else if (!accessToken) {
                navigate('/signin')
                setLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        if (isSuccess) {
            dispatch(setAccessToken(newAccessToken))

            if (path.pathname === '/' || path.pathname === '/signin') {
                navigate('/dashboard')
            }
            setLoading(false)
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            navigate('/signin')
            setLoading(false)
        }
    }, [isError])

    if (loading) return <></>

    return (
        <div>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index path="dashboard" element={<DashboardPage />} />
                    <Route path="mediareports" element={<MediaReportsPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route>
                        <Route path="tasklist" element={<TaskListPage />} />
                        <Route path="tasklist/task" element={<TaskPage />} />
                    </Route>
                    <Route path="users" element={<UsersPage />} />
                    <Route path="roles" element={<RolesPage />} />
                    <Route
                        path="organizations"
                        element={<OrganizationsPage />}
                    />

                    <Route path="checkpoints" element={<CheckpointsPage />} />
                    <Route path="branches" element={<BranchesPage />} />
                    <Route
                        path="manage-properties"
                        element={<ManagePropertiesPage />}
                    />
                </Route>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    )
}

export default App
