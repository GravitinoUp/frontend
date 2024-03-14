import { Fragment } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ImportIcon from '@/assets/icons/import.svg'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const ActionButtons = () => {
    const { t } = useTranslation()

    return (
        <Fragment>
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
                    <DropdownMenuItem onClick={() => console.log('Download')}>
                        <ImportIcon />
                        <p className="ml-2">{t('action.dropdown.download')}</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
