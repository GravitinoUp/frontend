import { Dispatch, SetStateAction, useState } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { FileData } from '../file-container/multi-file-input'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../ui/carousel'
import { Dialog, DialogContent } from '../ui/dialog'
import CloseRounded from '@/assets/icons/close_rounded.svg'
import DownloadRounded from '@/assets/icons/download_rounded.svg'
import RotateIcon from '@/assets/icons/rotate.svg'
import { cn } from '@/lib/utils'

interface ImageCarouselDialogProps {
    files: FileData[]
    startIndex: number
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const ImageCarouselDialog = ({
    files,
    startIndex,
    open,
    setOpen,
}: ImageCarouselDialogProps) => {
    const [rotation, setRotation] = useState(0)
    const [carouselApi, setCarouselApi] = useState<
        EmblaCarouselType | undefined
    >()
    const [slidesInView, setSlidesInView] = useState<number[]>([])

    const handleSlidesInView = (api: EmblaCarouselType) => {
        setSlidesInView(api.slidesInView())
    }

    carouselApi?.on('slidesInView', handleSlidesInView)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="bg-transparent border-none rounded-none w-full max-w-full h-screen shadow-none"
                onOpenAutoFocus={(e) => e.preventDefault}
                header={
                    <div className="absolute flex gap-5 right-16 pt-4 pl-4">
                        <div onClick={() => setRotation(rotation + 90)}>
                            <RotateIcon />
                        </div>
                        <div onClick={() => {}}>
                            <DownloadRounded />
                        </div>
                    </div>
                }
                closeIcon={<CloseRounded />}
            >
                <Carousel
                    className="border-none rounded-xl mt-10 p-3 select-none"
                    opts={{ startIndex }}
                    setApi={(api) => setCarouselApi(api)}
                >
                    <CarouselContent className="h-full">
                        {files.map((value) => (
                            <CarouselItem
                                key={value.id}
                                className="flex justify-center"
                                style={{ height: window.screen.height * 0.6 }}
                            >
                                <img
                                    src={
                                        value.file
                                            ? URL.createObjectURL(value.file)
                                            : value.fileURL
                                    }
                                    className="object-scale-down"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        scale:
                                            (rotation / 90) % 2 !== 0
                                                ? '0.7'
                                                : undefined,
                                    }}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                </Carousel>
                <Carousel
                    className="flex justify-center select-none"
                    opts={{ skipSnaps: true }}
                >
                    <CarouselContent>
                        {files.map((value, index) => (
                            <CarouselItem
                                key={value.id}
                                className="basis-auto"
                                onClick={() => carouselApi?.scrollTo(index)}
                            >
                                <div className="relative rounded-xl overflow-hidden">
                                    <div
                                        className={cn(
                                            'absolute w-full h-full',
                                            slidesInView[0] !== index &&
                                                'bg-[#10141A] bg-opacity-60'
                                        )}
                                    />
                                    <img
                                        src={
                                            value.file
                                                ? URL.createObjectURL(
                                                      value.file
                                                  )
                                                : value.fileURL
                                        }
                                        className="w-[150px] h-[100px] object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </DialogContent>
        </Dialog>
    )
}

export default ImageCarouselDialog
