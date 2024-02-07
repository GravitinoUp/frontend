import { BaseSyntheticEvent, Fragment, useRef, useState } from 'react'
import { Button } from '../ui/button'
import ArchiveImportLight from '@/assets/icons/archive_import_light.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import ExcelFile from '@/assets/icons/excel_file.svg'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/utils/helpers'

interface FileContainerProps {
    onSubmit: (file: File) => void
}

const FileContainer = ({ onSubmit }: FileContainerProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File>()

    const [dragActive, setDragActive] = useState<boolean>(false)

    const handleAddClick = () => {
        if (inputRef !== null) {
            inputRef.current!.click()
        }
    }

    const handleRemoveClick = () => {
        setSelectedFile(undefined)
    }

    const handleFileChange = (event: BaseSyntheticEvent) => {
        setSelectedFile(event.target.files && event.target.files[0])
        event.target.value = null
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        setSelectedFile(e.dataTransfer.files && e.dataTransfer.files[0])
        setDragActive(false)
    }

    return (
        <Fragment>
            <div
                className={cn(
                    'flex flex-col items-center mt-8 justify-center bg-muted border-[#C6C9CC] border-[1.5px] border-dashed rounded-xl select-none h-[120px]',
                    !selectedFile ? 'cursor-pointer p-7' : 'p-5'
                )}
                onClick={!selectedFile ? handleAddClick : undefined}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    style={{ display: 'none' }}
                    ref={inputRef}
                    type="file"
                    accept="text/csv"
                    onChange={handleFileChange}
                />
                {selectedFile ? (
                    <div className="w-full flex justify-between border rounded-xl p-4">
                        <div className="flex items-center">
                            <ExcelFile />
                            <div className="ml-4">
                                <p className="text-xs">{selectedFile.name}</p>
                                <p className="text-xs text-body-light mt-1">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Button
                                className="px-6 py-2 mr-4"
                                onClick={() => onSubmit(selectedFile)}
                            >
                                Импорт
                            </Button>
                            <div
                                className="cursor-pointer"
                                onClick={handleRemoveClick}
                            >
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                ) : !dragActive ? (
                    <div className="flex flex-col items-center pointer-events-none">
                        <ArchiveImportLight />
                        <p>
                            Перетащите файл или{' '}
                            <span className="text-primary underline font-semibold">
                                Нажмите
                            </span>{' '}
                            чтобы Импортировать
                        </p>
                    </div>
                ) : (
                    <div className="h-[60px]"></div>
                )}
            </div>
        </Fragment>
    )
}

export default FileContainer
