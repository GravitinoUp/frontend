import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { Layuot } from './components/Layout'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import BranchesPage from './pages/branches'
import CheckpointsPage from './pages/checkpoints'
import { DashboardPage } from './pages/dashboard/page'
import ManagePropertiesPage from './pages/manage-properties'
import MediaReportspage from './pages/mediareports/page'
import NotFoundpage from './pages/notfound/page'
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
                    <Route path="/" element={<Layuot />}>
                        <Route
                            index
                            path="dashboard"
                            element={<DashboardPage />}
                        />
                        <Route
                            path="mediareports"
                            element={<MediaReportspage />}
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
                        <Route
                            path="manage-properties"
                            element={<ManagePropertiesPage />}
                        />
                        <Route path="*" element={<NotFoundpage />} />
                    </Route>
                )}
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundpage />} />
            </Routes>
        </div>
    )
}

export default App
