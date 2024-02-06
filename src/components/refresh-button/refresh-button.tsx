import { RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

const RefreshButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        variant="outline"
        size="icon"
        className="bg-white border-solid border-[2px] rounded-3xl flex items-center justify-center p-[7px] size-8"
        onClick={onClick}
    >
        <div className="">
            <RefreshCw color="black" size={17} />
        </div>
    </Button>
)

export default RefreshButton
