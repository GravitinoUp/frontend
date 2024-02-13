import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import BranchesPage from './pages/branches'
import CheckpointsPage from './pages/checkpoints'
import { DashboardPage } from './pages/dashboard/page'
import MediaReportsPage from './pages/mediareports/page'
import NotFoundPage from './pages/notfound/page'
import OrganizationsPage from './pages/organizations'
import { RegisterPage } from './pages/register/page'
import ReportsPage from './pages/reports/page'
import RolesPage from './pages/roles'
import SettingsPage from './pages/settings'
import { SignInPage } from './pages/signin/page'
import TaskListPage from './pages/tasklist'
import TaskPage from './pages/tasklist/task'
import UsersPage from './pages/users'

import { fetchRefreshAuth } from './redux/reducers/userSlice'

function App() {
    const dispatch = useAppDispatch()
    const { isLogin, status, user } = useAppSelector((state) => state.auth)
    const path = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (
            (isLogin && path.pathname === '/') ||
            (isLogin && path.pathname === '/signin')
        ) {
            navigate('/dashboard')
        }

        if (!isLogin && status !== 'loading') {
            navigate('/signin')
        }
    }, [isLogin])

    window.onstorage = (event) => {
        if (event.key !== 'r  efreshToken') return

        navigate('/signin')
    }

    useEffect(() => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken !== null) {
            dispatch(fetchRefreshAuth(refreshToken))
        } else {
            navigate('/signin')
        }
    }, [])
    if (status === 'loading') return <></>

    return (
        <div>
            <Routes>
                {user && (
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            path="dashboard"
                            element={<DashboardPage />}
                        />
                        <Route
                            path="mediareports"
                            element={<MediaReportsPage />}
                        />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route>
                            <Route path="tasklist" element={<TaskListPage />} />
                            <Route
                                path="tasklist/task"
                                element={<TaskPage />}
                            />
                        </Route>
                        <Route path="users" element={<UsersPage />} />
                        <Route path="roles" element={<RolesPage />} />
                        <Route
                            path="organizations"
                            element={<OrganizationsPage />}
                        />

                        <Route
                            path="checkpoints"
                            element={<CheckpointsPage />}
                        />
                        <Route path="branches" element={<BranchesPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                )}
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    )
}

export default App
