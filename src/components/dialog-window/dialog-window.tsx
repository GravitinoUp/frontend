import { Dispatch, ReactNode, SetStateAction } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import PlusButton from '../plus-button/plus-button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '../ui/dialog'
import CloseRounded from '@/assets/icons/close_rounded.svg'
import { PermissionEnum } from '@/constants/permissions.enum'
import { cn } from '@/lib/utils'
import { getPermissionValue } from '@/utils/helpers'

const dialogVariants = cva('', {
    variants: {
        size: {
            default: 'sm:max-w-[600px] px-8 pt-0 pb-8',
            md: 'sm:max-w-[820px]',
            lg: 'sm:max-w-[1100px]',
        },
    },
    defaultVariants: {
        size: 'default',
    },
})

interface DialogWindowProps extends VariantProps<typeof dialogVariants> {
    header?: ReactNode
    trigger?: ReactNode | null
    triggerPermissions?: PermissionEnum[]
    content: ReactNode
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
}

const DialogWindow = ({
    header,
    trigger = <PlusButton />,
    triggerPermissions = [],
    content,
    open,
    setOpen,
    size,
}: DialogWindowProps) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {getPermissionValue(triggerPermissions) && trigger}
        </DialogTrigger>
        <DialogContent
            className={cn(dialogVariants({ size }))}
            onOpenAutoFocus={(e) => e.preventDefault}
            closeIcon={<CloseRounded />}
        >
            <DialogHeader>{header}</DialogHeader>
            {content}
        </DialogContent>
    </Dialog>
)

DialogWindow.displayName = 'DialogWindow'

export default DialogWindow