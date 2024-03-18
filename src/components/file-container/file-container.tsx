import React, { BaseSyntheticEvent, Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '../spinner/spinner'
import { Button } from '../ui/button'
import ArchiveImportLight from '@/assets/icons/archive_import_light.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import ExcelFile from '@/assets/icons/excel_file.svg'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/utils/helpers'

interface FileContainerProps {
    onSubmit: (file: File) => void
    fileType?: string
    uploadIcon?: React.ReactNode
    isLoading?: boolean
}

const FileContainer = ({
    onSubmit,
    fileType = '*/*',
    uploadIcon = <ArchiveImportLight />,
    isLoading,
}: FileContainerProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File>()
    const { t } = useTranslation()

    const [dragActive, setDragActive] = useState<boolean>(false)

    const handleAddClick = () => {
        if (inputRef !== null && !selectedFile) {
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
                onClick={handleAddClick}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    style={{ display: 'none' }}
                    ref={inputRef}
                    type="file"
                    accept={fileType}
                    onChange={handleFileChange}
                />
                {selectedFile ? (
                    <div className="w-full flex justify-between border rounded-xl p-4">
                        <div className="flex items-center">
                            {fileType ===
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && (
                                <div className="w-[31px] h-[40px]">
                                    <ExcelFile />
                                </div>
                            )}
                            <div className="ml-4">
                                <p className="text-xs">{selectedFile.name}</p>
                                <p className="text-xs text-body-light mt-1">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Button
                                type="button"
                                className="px-6 py-2 mr-4 w-[100px]"
                                onClick={() => onSubmit(selectedFile)}
                                disabled={isLoading}
                            >
                                {isLoading ? <LoadingSpinner /> : t('import')}
                            </Button>
                            <div
                                className="cursor-pointer"
                                onClick={handleRemoveClick}
                            >
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'flex flex-col gap-1.5 items-center pointer-events-none',
                            dragActive && 'invisible'
                        )}
                    >
                        {uploadIcon}
                        <p className="mt-2">
                            {t('file.import.drag')}
                            <span className="text-primary underline font-semibold">
                                {t('file.import.click')}
                            </span>{' '}
                            {t('file.import')}
                        </p>
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default FileContainer
