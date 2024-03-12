import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FileData } from '../file-container/multi-file-input'
import { Button } from '../ui/button'
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
}: ImageCarouselDialogProps) => {
    const [rotation, setRotation] = useState(0)

    useEffect(() => {
        console.log(rotation)
    }, [rotation])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="bg-transparent border-none rounded-none w-full max-w-full h-screen shadow-none"
                onOpenAutoFocus={(e) => e.preventDefault}
                header={
                    <div className="absolute pt-4 pl-4">
                        <Button
                            variant="ghost"
                            onClick={() => setRotation(rotation - 90)}
                        >
                            Повернуть на 90 влево
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setRotation(rotation + 90)}
                        >
                            Повернуть на 90 вправо
                        </Button>
                    </div>
                }
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
                                    src={
                                        value.file
                                            ? URL.createObjectURL(value.file)
                                            : value.fileURL
                                    }
                                    className="object-contain"
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
            </DialogContent>
        </Dialog>
    )
}

export default ImageCarouselDialog
