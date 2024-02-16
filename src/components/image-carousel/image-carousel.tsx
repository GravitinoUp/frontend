import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import DownloadIcon from '@/assets/icons/download.svg'
import DownloadAllIcon from '@/assets/icons/download_all.svg'
import ViewIcon from '@/assets/icons/view.svg'

interface ImageCarouselProps {
    files: string[]
    onShowClick: (index: number) => void
}

const ImageCarousel = ({ files, onShowClick }: ImageCarouselProps) => {
    const { t } = useTranslation()

    return (
        files.length > 0 && (
            <Carousel className="flex w-fit border rounded-xl mt-10 p-3 select-none">
                <CarouselContent>
                    {files.map((value, index) => (
                        <CarouselItem key={value} className="basis-auto">
                            <div className="relative rounded-xl overflow-hidden group">
                                <div className="absolute w-full h-full flex justify-center items-center bg-black bg-opacity-50 invisible group-hover:visible">
                                    <Button
                                        variant="ghost"
                                        className="p-2 hover:bg-white hover:bg-opacity-10"
                                        onClick={() => onShowClick(index)}
                                    >
                                        <ViewIcon />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="p-2 hover:bg-white hover:bg-opacity-10"
                                        onClick={() => {}}
                                    >
                                        <DownloadIcon />
                                    </Button>
                                </div>
                                <img
                                    src={value}
                                    className="w-[90px] h-[90px] object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselItem className="basis-auto overflow-hidden">
                    <Button
                        variant="ghost"
                        className="w-[90px] h-[90px] flex flex-col justify-center items-center rounded-xl"
                        onClick={() => {}}
                    >
                        <DownloadAllIcon />
                        <p className="text-xs">{t('download.all')}</p>
                    </Button>
                </CarouselItem>
            </Carousel>
        )
    )
}

export default ImageCarousel
