import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from './components/ui/toaster.tsx'
import { store } from './redux/store.ts'
import './i18n'
import { TaskFilterQueryProvider } from '@/context/tasks/tasks-filter-query.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <TaskFilterQueryProvider>
                    <App />
                    <Toaster />
                </TaskFilterQueryProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
