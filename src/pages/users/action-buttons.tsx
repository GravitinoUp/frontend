import { Fragment, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AddUserForm from './add-user-form'
import FormDialog from '@/components/form-dialog/form-dialog'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserInterface } from '@/types/interface/user'

export const ActionButtons = ({ user }: { user: UserInterface }) => {
    const [formOpen, setFormOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <Fragment>
            <FormDialog
                open={formOpen}
                setOpen={setFormOpen}
                actionButton={<Fragment />}
                addItemForm={
                    <AddUserForm user={user} setDialogOpen={setFormOpen} />
                }
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A9099]"
                    >
                        <span className="sr-only">
                            {t('action.dropdown.menu.open')}
                        </span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setFormOpen(true)
                        }}
                    >
                        {t('action.dropdown.edit')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
