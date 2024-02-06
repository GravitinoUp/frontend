import { Dispatch, ReactNode, SetStateAction } from 'react'
import PlusButton from '../plus-button/plus-button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '../ui/dialog'

interface FormDialogProps {
    headerContent?: ReactNode
    actionButton?: ReactNode
    addItemForm: ReactNode
    open?: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
}

const FormDialog = ({
    headerContent,
    actionButton = <PlusButton onClick={() => {}} />,
    addItemForm,
    open,
    setOpen,
}: FormDialogProps) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{actionButton}</DialogTrigger>
        <DialogContent
            className="sm:max-w-[600px]"
            onOpenAutoFocus={(e) => e.preventDefault}
        >
            <DialogHeader>{headerContent}</DialogHeader>
            {addItemForm}
        </DialogContent>
    </Dialog>
)

export default FormDialog
