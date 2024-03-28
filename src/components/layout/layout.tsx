import { ReactNode, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './header.tsx'
import { Navbar } from './navbar.tsx'
import useEscape from '../../hooks/use-escape.ts'

export function Layout({ children }: { children?: ReactNode }) {
    const [open, setOpen] = useState(false)
    useEscape(() => setOpen(false))

    return (
        <main
            className={
                open
                    ? 'min-h-screen grid grid-cols-[270px_auto] bg-[#F8F8F8] duration-300'
                    : 'min-h-screen grid grid-cols-[75px_auto] bg-[#F8F8F8] duration-300'
            }
        >
            <div className="col-1">
                <div className="sticky top-0">
                    <Navbar open={open} setOpen={setOpen} />
                </div>
            </div>

            <div className="grid grid-rows-[65px_auto] col-2">
                <header className="row-1 z-10 flex sticky top-0">
                    <Header open={open} setOpen={setOpen} />
                </header>

                <div className="bg-[#F8F8F8] items-start flex place-items-start justify-start row-2 overflow-visible overflow-y-auto">
                    <Outlet />
                    {children}
                </div>
            </div>
        </main>
    )
}
