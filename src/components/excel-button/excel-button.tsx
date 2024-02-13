import React from 'react'
import { Button } from '../ui/button'
import ArchiveExport from '@/assets/icons/archive_export.svg'
import ArchiveImport from '@/assets/icons/archive_import.svg'
import ArrowDown from '@/assets/icons/arrow_down.svg'

interface ExcelButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType: 'export' | 'import'
}

const ExcelButton = React.forwardRef<HTMLButtonElement, ExcelButtonProps>(
    ({ buttonType, onClick }, ref) => (
        <Button
            ref={ref}
            className="bg-white hover:bg-accent rounded-xl"
            onClick={onClick}
        >
            {buttonType === 'export' ? <ArchiveExport /> : <ArchiveImport />}
            <p className="mx-[8px] text-base font-normal">
                {buttonType === 'export' ? 'Экспорт' : 'Импорт'}
            </p>
            <ArrowDown />
        </Button>
    )
)

ExcelButton.displayName = 'ExcelButton'

export default ExcelButton
