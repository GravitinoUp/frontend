import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@/assets/icons/delete.svg'
import {
    FileData,
    MultiFileInput,
} from '@/components/file-container/multi-file-input.tsx'
import { LoadingSpinner } from '@/components/spinner/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { useErrorToast } from '@/hooks/use-error-toast.tsx'
import { useSuccessToast } from '@/hooks/use-success-toast.tsx'
import { useUploadFileMutation } from '@/redux/api/orders.ts'

interface FilesUploadFormProps {
    orderIDs?: number[]
    setDialogOpen?: Dispatch<SetStateAction<boolean>>
}

export const FilesUploadForm = ({
    orderIDs,
    setDialogOpen,
}: FilesUploadFormProps) => {
    const { t } = useTranslation()
    const [selectedFiles, setSelectedFiles] = useState<FileData[]>([])
    const [uploadFiles, { isLoading, error, isSuccess }] =
        useUploadFileMutation()
    //const [error, setError] = useState(false)

    const handleFileUpload = (e: FormEvent) => {
        //setError(false)
        e.preventDefault()
        const formData = new FormData()
        selectedFiles.forEach((value) => {
            formData.append('files', value.file!)
        })

        if (typeof orderIDs !== 'undefined' && orderIDs.length > 0) {
            uploadFiles({
                formData,
                orderIDs,
                directory: 'orders',
            })
        } else {
            //setError(true)
        }
    }

    const handleFileDelete = (id: string) => {
        const result = selectedFiles.filter((data) => data.id !== id)
        setSelectedFiles(result)
    }

    const uploadSuccessMsg = useMemo(
        () =>
            t('toast.success.description.create.multiple', {
                entityType: t('files'),
            }),
        []
    )

    useSuccessToast(uploadSuccessMsg, isSuccess, setDialogOpen)
    useErrorToast(undefined, error)

    return (
        <form onSubmit={handleFileUpload}>
            <MultiFileInput
                setSelectedFiles={setSelectedFiles}
                disabled={isLoading}
            />
            {selectedFiles.length > 0 && (
                <ScrollArea className="w-full pr-3 h-[390px]  mt-16 ">
                    <div className="flex flex-col gap-16">
                        <ul className="flex flex-col gap-3">
                            {selectedFiles.map(({ id, file, fileURL }) => (
                                <li
                                    key={id}
                                    className="h-[90px] border rounded-xl flex justify-between items-center px-3"
                                >
                                    <div className="flex gap-2 items-center">
                                        <img
                                            src={
                                                file
                                                    ? URL.createObjectURL(file)
                                                    : fileURL
                                            }
                                            className="h-[72px] w-[72px] rounded-xl"
                                            alt=""
                                        />
                                        <p className="text-xs max-w-[400px] overflow-ellipsis overflow-hidden">
                                            {file?.name}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleFileDelete(id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScrollArea>
            )}
            <div className="flex gap-4 absolute bottom-8">
                <Button
                    type="submit"
                    className="rounded-xl w-[120px]"
                    disabled={selectedFiles.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        t('button.action.files.upload')
                    )}
                </Button>
            </div>
        </form>
    )
}
