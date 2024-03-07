import { Dispatch, SetStateAction } from 'react'
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
}: ImageCarouselDialogProps) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
            className="bg-transparent border-none rounded-none w-full max-w-full h-screen shadow-none"
            onOpenAutoFocus={(e) => e.preventDefault}
            closeIcon={<CloseRounded />}
        >
            <Carousel
                className="border-none rounded-xl mt-10 p-3 select-none"
                opts={{ startIndex }}
            >
                <CarouselContent className="h-full">
                    {files.map((value) => (
                        <CarouselItem
                            key={value.id}
                            className="flex justify-center"
                        >
                            <img
                                src={value.fileimage}
                                className="object-none align-middle"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
            </Carousel>
        </DialogContent>
    </Dialog>
)

export default ImageCarouselDialog
