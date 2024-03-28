import {
    Document,
    Font,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'
import bgImage from '@/assets/icons/QR-Code-Scan-Banner.png'
import { CheckpointInterface } from '@/types/interface/checkpoint.ts'

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
})

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
    },
    qrCode: {
        width: '140px',
        height: '140px',
        position: 'absolute',
        top: 340,
        left: 222,
    },
    header: {
        fontFamily: 'Roboto',
        fontSize: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: 25,
        left: 40,
        width: '525px',
    },
    title: {
        fontFamily: 'Roboto',
    },
})

interface QRPageProps {
    checkpoint: CheckpointInterface
    QRsrc: string
}

export const QRpage = ({ checkpoint, QRsrc }: QRPageProps) => {
    const { t } = useTranslation()

    return (
        <Document
            title={t('PDF.QR.title', {
                checkpointName: checkpoint.checkpoint_name,
            })}
            language="ru"
        >
            <Page size="A4">
                <View>
                    <Image src={bgImage} style={styles.backgroundImage} cache />
                    <Image src={QRsrc} style={styles.qrCode} />
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {checkpoint.checkpoint_name}
                        </Text>
                        <Text>
                            {t('address')}: {checkpoint.address}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
