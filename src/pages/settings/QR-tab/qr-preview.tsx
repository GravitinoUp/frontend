import { BlobProvider } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'
import QRPreviewIcon from '@/assets/icons/QR-preview.svg'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'
import { QRpage } from '@/pages/QR-pdf/QR-pdf.tsx'
import { CheckpointInterface } from '@/types/interface/checkpoint.ts'

interface QRPreviewProps {
    checkpoint: CheckpointInterface
    QRsrc: string
}

export const QRPreview = ({ checkpoint, QRsrc }: QRPreviewProps) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-[28px] font-semibold text-center mb-10">
                {checkpoint.checkpoint_name}
            </h2>
            <span>
                <QRPreviewIcon />
            </span>
            <BlobProvider
                document={<QRpage checkpoint={checkpoint} QRsrc={QRsrc} />}
            >
                {({ url, loading }) => (
                    <Button
                        className={cn(
                            'rounded-2xl mt-11 w-[260px]',
                            loading &&
                                'pointer-events-none disabled:cursor-not-allowed opacity-50'
                        )}
                        asChild
                    >
                        <a
                            className={cn(
                                loading &&
                                    'pointer-events-none disabled:cursor-not-allowed opacity-50'
                            )}
                            href={url || ''}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {loading
                                ? t('PDF.QR.loading')
                                : t('action.dropdown.download')}
                        </a>
                    </Button>
                )}
            </BlobProvider>
        </div>
    )
}
