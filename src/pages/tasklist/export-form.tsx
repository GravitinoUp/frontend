import { Button } from '@/components/ui/button'

const ExportForm = () => (
    <div className="w-full mt-8">
        <Button
            className="w-full text-sm font-normal"
            onClick={() => console.log('Download template')}
        >
            Экспорт
        </Button>
    </div>
)

export default ExportForm
