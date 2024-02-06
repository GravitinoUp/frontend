import { Search, ChevronRight, ChevronLeft, BellIcon } from 'lucide-react'

import AccountMenu from './account-menu/account-menu'
import { NavbarProps } from './Navbar'

import { Separator } from '@/components/ui/separator'

export function Header({ open, setOpen }: NavbarProps) {
    return (
        <div className="grid grid-cols-[50px_auto]  items-center min-w-full bg-white h-16 border-solid border-l-[2px] border-b-[2px] ">
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
            <div className="flex  items-center place-items-end justify-end gap-3 p-[10px]   ">
                <div className="flex items-center gap-4">
                    <Search size={20} />

                    <BellIcon color="#3F434A" size={20} />
                </div>
                <Separator
                    orientation="vertical"
                    className="h-[31px] w-[2px]"
                />

                <AccountMenu />
            </div>
        </div>
    )
}
