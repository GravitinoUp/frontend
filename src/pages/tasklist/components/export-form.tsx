import { useTranslation } from 'react-i18next'
import ExcelFile from '@/assets/icons/excel_file.svg'
import { Button } from '@/components/ui/button'

const ExportForm = () => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center">
            <div className="absolute w-[110px] h-[110px] bg-background border-[1.5px] border-dashed border-[#C6C9CC] rounded-full p-2">
                <div className="flex items-center justify-center rounded-full bg-muted w-full h-full">
                    <div className="w-[43px] h-[56px]">
                        <ExcelFile />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center self-stretch mx-16 mt-16 justify-center bg-muted border-input border-[1.5px] rounded-xl select-none h-[140px] pt-16">
                <Button className="text-sm px-12 py-4" onClick={() => {
                }}>
                    {t('export')}
                </Button>
            </div>
        </div>
    )
}

export default ExportForm
