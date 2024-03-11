import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import FileContainer from '@/components/file-container/file-container'
import { Button } from '@/components/ui/button'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useGetEntityTemplateMutation } from '@/redux/api/files'
import { TemplateType } from '@/types/interface/files'

const ImportForm = ({ type }: { type: TemplateType }) => {
    const { t } = useTranslation()

    const [getTemplateFile, { error }] = useGetEntityTemplateMutation()

    useErrorToast(() => getTemplateFile(type), error)

    return (
        <Fragment>
            <FileContainer
                onSubmit={(file) => console.log(file)}
                fileType="text/csv"
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
