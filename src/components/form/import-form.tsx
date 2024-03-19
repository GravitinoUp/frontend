import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import FileContainer from '@/components/file-container/file-container'
import { Button } from '@/components/ui/button'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useSuccessToast } from '@/hooks/use-success-toast'
import {
    useGetEntityTemplateMutation,
    useImportDataMutation,
} from '@/redux/api/files'
import { TemplateType } from '@/types/interface/files'

const ImportForm = ({ type }: { type: TemplateType }) => {
    const { t } = useTranslation()

    const [importData, { error: importError, isSuccess, isLoading }] =
        useImportDataMutation()
    const [getTemplateFile, { error }] = useGetEntityTemplateMutation()

    const importSuccessMsg = useMemo(
        () => t('toast.success.description.import'),
        []
    )

    useSuccessToast(importSuccessMsg, isSuccess)
    useErrorToast(() => getTemplateFile(type), importError || error)

    return (
        <Fragment>
            <FileContainer
                onSubmit={(file) => {
                    const formData = new FormData()
                    formData.append('file', file)

                    importData({
                        entity:
                            type !== 'organization'
                                ? type
                                : 'users/organization',
                        formData,
                    })
                }}
                fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                isLoading={isLoading}
            />
            <Button
                variant="link"
                className="text-sm font-normal"
                onClick={() => getTemplateFile(type)}
            >
                {t('file.example.download')}
            </Button>
        </Fragment>
    )
}

export default ImportForm
