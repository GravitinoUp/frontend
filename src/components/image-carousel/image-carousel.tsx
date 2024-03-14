import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import ImageCarouselDialog from './image-carousel-dialog'
import { FileData, MultiFileInput } from '../file-container/multi-file-input'
import { Button } from '../ui/button'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import DownloadIcon from '@/assets/icons/download.svg'
import RemoveIcon from '@/assets/icons/remove.svg'
import ViewIcon from '@/assets/icons/view.svg'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useGetFileFromUrlMutation } from '@/redux/api/files'

interface ImageCarouselProps {
    files: FileData[]
    setSelectedFiles?: Dispatch<SetStateAction<FileData[]>>
    suffixButton: React.ReactNode
}

const ImageCarousel = ({
    files,
    setSelectedFiles,
    suffixButton,
}: ImageCarouselProps) => {
    const [open, setOpen] = useState(false)

    const [dialogStartIndex, setDialogStartIndex] = useState(0)

    const handleFileDelete = (id: string) => {
        const result = files.filter((data) => data.id !== id)
        setSelectedFiles!(result)
    }

    const [getFileFromUrl, { error, isLoading }] = useGetFileFromUrlMutation()

    useErrorToast(undefined, error)

    return files.length > 0 ? (
        <Fragment>
            <ImageCarouselDialog
                files={files}
                startIndex={dialogStartIndex}
                open={open}
                setOpen={setOpen}
            />

            <Carousel
                className="flex w-fit border rounded-xl mt-10 p-3 select-none"
                opts={{ skipSnaps: true }}
            >
                <CarouselContent>
                    {files.map((value, index) => (
                        <CarouselItem key={value.id} className="basis-auto">
                            {setSelectedFiles && (
                                <div
                                    className="flex justify-center absolute w-[90px] z-10"
                                    onClick={() => handleFileDelete(value.id)}
                                >
                                    <RemoveIcon />
                                </div>
                            )}
                            <div className="relative rounded-xl overflow-hidden group">
                                {!setSelectedFiles && (
                                    <div className="absolute w-full h-full flex justify-center items-center bg-black bg-opacity-50 invisible group-hover:visible">
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            className="p-2 hover:bg-white hover:bg-opacity-10"
                                            onClick={() => {
                                                setDialogStartIndex(index)
                                                setOpen(true)
                                            }}
                                        >
                                            <ViewIcon />
                                        </Button>
                                        {value.fileURL && (
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                className="p-2 hover:bg-white hover:bg-opacity-10"
                                                disabled={isLoading}
                                                onClick={() =>
                                                    getFileFromUrl(
                                                        value.fileURL!
                                                    )
                                                }
                                            >
                                                <DownloadIcon />
                                            </Button>
                                        )}
                                    </div>
                                )}
                                <img
                                    src={
                                        value.file
                                            ? URL.createObjectURL(value.file)
                                            : value.fileURL
                                    }
                                    className="w-[90px] h-[90px] object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselItem className="basis-auto overflow-hidden">
                    {suffixButton}
                </CarouselItem>
            </Carousel>
        </Fragment>
    ) : (
        setSelectedFiles && (
            <MultiFileInput setSelectedFiles={setSelectedFiles!} />
        )
    )
}

export default ImageCarousel
