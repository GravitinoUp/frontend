import { ChevronLeft, ChevronRight } from 'lucide-react'

import AccountMenu from './account-menu/account-menu'
import { NavbarProps } from './Navbar'

export function Header({ open, setOpen }: NavbarProps) {
    return (
        <div className="grid grid-cols-[50px_auto] items-center min-w-full bg-white h-16 border-solid border-l-[2px] border-b-[2px] ">
            <div
                className="items-center cursor-pointer justify-center ml-3"
                onClick={() => setOpen(!open)}
            >
                {open ? (
                    <ChevronLeft size={20} color="#3F434A" />
                ) : (
                    <ChevronRight size={20} color="#3F434A" />
                )}
            </div>
            <div className="flex items-center place-items-end justify-end gap-3 p-[10px]">
                <AccountMenu />
            </div>
        </div>
    )
}
