import { QUALITY_STATUSES } from "@/constants/constants"

export default function getQualityColor(percent: number, light: boolean) {
    if (percent >= QUALITY_STATUSES.HIGH) {
        return light ? '#DBF2E2' : '#49C96D'
    } else if (percent >= QUALITY_STATUSES.MEDIUM) {
        return light ? '#FFF4D0' : '#FFD240'
    } else {
        return light ? '#FFEAEA' : '#FF6B6B'
    }
}