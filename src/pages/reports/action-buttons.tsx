import { Fragment, useContext, useMemo } from 'react'
import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReportsFilterQueryContext } from '@/context/tasks/reports-filter-query'
import { useErrorToast } from '@/hooks/use-error-toast'
import { useSuccessToast } from '@/hooks/use-success-toast'
import {
    useSaveCheckpointReportsMutation,
    useSaveOrganizationReportsMutation,
} from '@/redux/api/reports'
import { REPORTS, REPORTS_CHECKPOINTS } from '@/routes'
import { FormattedReportInterface } from '@/types/interface/report'

interface ActionButtonsProps {
    rowData: FormattedReportInterface
}

export const ActionButtons = ({ rowData }: ActionButtonsProps) => {
    const { t } = useTranslation()
    const location = useLocation()

    const { reportsQuery } = useContext(ReportsFilterQueryContext)

    const [
        saveBranchReport,
        {
            isLoading: isBranchLoading,
            isSuccess: isBranchSuccess,
            error: branchError,
        },
    ] = useSaveCheckpointReportsMutation()
    const [
        saveCheckpointReport,
        {
            isLoading: isCheckpointLoading,
            isSuccess: isCheckpointSuccess,
            error: checkpointError,
        },
    ] = useSaveOrganizationReportsMutation()

    const handleSaveReport = () => {
        if (location.pathname === REPORTS) {
            saveBranchReport({ ...reportsQuery, branch_id: rowData.id })
        } else if (location.pathname === REPORTS_CHECKPOINTS) {
            saveCheckpointReport({ ...reportsQuery, checkpoint_id: rowData.id })
        }
    }

    const successMsg = useMemo(
        () =>
            t('toast.success.description.save.m', {
                entityType: t('report'),
            }),
        []
    )

    useSuccessToast(successMsg, isBranchSuccess || isCheckpointSuccess)
    useErrorToast(handleSaveReport, branchError || checkpointError)

    return (
        <Fragment>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A9099]"
                    >
                        <span className="sr-only">
                            {t('action.dropdown.menu.open')}
                        </span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={handleSaveReport}
                        disabled={isBranchLoading || isCheckpointLoading}
                    >
                        {t('action.dropdown.download.data')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    )
}
