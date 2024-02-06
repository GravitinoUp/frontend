import { Button } from '../ui/button'
import ArchiveExport from '@/assets/icons/archive_export.svg'
import ArchiveImport from '@/assets/icons/archive_import.svg'
import ArrowDown from '@/assets/icons/arrow_down.svg'

interface Props {
    type: 'export' | 'import'
    onClick: () => void
}

const ExcelButton = ({ type, onClick }: Props) => (
    <Button className="bg-white hover:bg-accent rounded-xl" onClick={onClick}>
        {type === 'export' ? <ArchiveExport /> : <ArchiveImport />}
        <p className="mx-[8px] text-base font-normal">
            {type === 'export' ? 'Экспорт' : 'Импорт'}
        </p>
        <ArrowDown />
    </Button>
)

export default ExcelButton
