import { useTranslation } from 'react-i18next'

const Watermark = () => {
    const { t } = useTranslation()

    return (
        <p className="my-6 text-[#A9A9A9] text-lg">
            {t('feedback.made.in')}
            <span className="font-bold"> {t('gravitino')}</span>
        </p>
    )
}

export default Watermark
