import { Fragment } from 'react'
import FileContainer from '@/components/file-container/file-container'
import { Button } from '@/components/ui/button'

const ImportForm = () => (
    <Fragment>
        <FileContainer onSubmit={(file) => console.log(file)} />
        <Button
            variant="link"
            className="text-sm font-normal"
            onClick={() => {}}
        >
            Скачать пример таблицы
        </Button>
    </Fragment>
)

export default ImportForm
