import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import FileContainer from '@/components/file-container/file-container'
import { Button } from '@/components/ui/button'

const ImportForm = () => {
    const { t } = useTranslation()

    return (
        <Fragment>
            <FileContainer onSubmit={(file) => console.log(file)} />
            <Button
                variant="link"
                className="text-sm font-normal"
                onClick={() => {
                }}
            >
                {t('file.example.download')}
            </Button>
        </Fragment>
    )
}

export default ImportForm
