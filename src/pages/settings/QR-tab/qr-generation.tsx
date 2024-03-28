import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useTranslation } from 'react-i18next'
import { CustomAlert } from '@/components/custom-alert/custom-alert.tsx'
import DialogWindow from '@/components/dialog-window/dialog-window.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { QRPreview } from '@/pages/settings/QR-tab/qr-preview.tsx'
import { placeholderQuery } from '@/pages/tasklist/constants.ts'
import { useGetCheckpointsQuery } from '@/redux/api/checkpoints.ts'
import { FEEDBACK_GUEST } from '@/routes.ts'
import { CheckpointInterface } from '@/types/interface/checkpoint.ts'

const QRGeneration = () => {
    const [QRsrc, setQRsrc] = useState('')
    const [open, setOpen] = useState(false)
    const [qrError, setQrError] = useState(false)
    const { t } = useTranslation()

    const {
        data: checkpoint = {} as CheckpointInterface,
        isLoading: checkpointsLoading,
        isError: checkpointsError,
        isSuccess: checkpointsSuccess,
    } = useGetCheckpointsQuery(placeholderQuery, {
        selectFromResult: (result) => ({
            ...result,
            data: result.data?.data[0],
        }),
    })

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const qrLink = `${import.meta.env.VITE_BASE_URL}${FEEDBACK_GUEST}?checkpoint=${checkpoint.checkpoint_id}`
                const data = await QRCode.toDataURL(qrLink)
                setQRsrc(data)
            } catch (error) {
                console.error('Error generating QR code:', error)
                setQrError(true)
            }
        }

        if (checkpoint.checkpoint_id) {
            generateQRCode()
        }
    }, [checkpoint])

    return (
        <>
            <div className="flex items-end w-[840px]">
                <div className="w-[540px]">
                    {!checkpointsError && (
                        <Label className="inline-block mb-2">
                            {t('checkpoint')}
                        </Label>
                    )}
                    {checkpointsLoading && (
                        <Skeleton className="h-[40px] w-[540px] rounded-xl" />
                    )}
                    {checkpointsError && <CustomAlert />}
                    {checkpointsSuccess && (
                        <Input value={checkpoint.checkpoint_name} readOnly />
                    )}
                </div>
                <DialogWindow
                    open={open}
                    setOpen={setOpen}
                    trigger={
                        <Button
                            className="w-[120px] h-[40px] ml-8 rounded-2xl font-[700]"
                            disabled={
                                checkpointsError ||
                                checkpointsLoading ||
                                qrError
                            }
                        >
                            {t('button.action.create')}
                        </Button>
                    }
                    content={
                        <QRPreview checkpoint={checkpoint} QRsrc={QRsrc} />
                    }
                />
            </div>
            {qrError && (
                <CustomAlert
                    className="w-[640px] mt-8"
                    message={t('QR.generate.error')}
                />
            )}
        </>
    )
}

export default QRGeneration
