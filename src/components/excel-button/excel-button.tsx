import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import ArchiveExport from '@/assets/icons/archive_export.svg'
import ArchiveImport from '@/assets/icons/archive_import.svg'
import ArrowDown from '@/assets/icons/arrow_down.svg'

interface ExcelButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType: 'export' | 'import'
}

const ExcelButton = React.forwardRef<HTMLButtonElement, ExcelButtonProps>(
    ({ buttonType, onClick }, ref) => {
        const { t } = useTranslation()

        return (
            <Button
                ref={ref}
                className="w-full bg-white hover:bg-accent rounded-xl"
                onClick={onClick}
            >
                {buttonType === 'export' ? (
                    <ArchiveExport />
                ) : (
                    <ArchiveImport />
                )}
                <p className="mx-[8px] text-base font-normal">
                    {buttonType === 'export' ? t('export') : t('import')}
                </p>
                <ArrowDown />
            </Button>
        )
    }
)

ExcelButton.displayName = 'ExcelButton'

export default ExcelButton
