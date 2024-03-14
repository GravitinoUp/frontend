import { Button } from '../ui/button'

interface ImageCarouselButtonProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

const ImageCarouselButton = ({
    icon,
    label,
    onClick,
}: ImageCarouselButtonProps) => (
    <Button
        variant="ghost"
        type="button"
        className="w-[90px] h-[90px] flex flex-col justify-center items-center rounded-xl"
        onClick={onClick}
    >
        {icon}
        <p className="text-xs">{label}</p>
    </Button>
)

export default ImageCarouselButton
