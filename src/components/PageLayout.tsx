import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RefreshButton from './refresh-button/refresh-button'
import { Button } from './ui/button'
import { PermissionEnum } from '@/constants/permissions.enum'
import { getPermissionValue } from '@/utils/helpers'

interface PageLayoutProps {
    title?: string
    backButtonEnabled?: boolean
    actionButton?: React.ReactNode
    actionButtonPermissions?: PermissionEnum[]
    rightBlock?: React.ReactNode
    onRefreshClick?: () => void
    isLoading?: boolean
    children?: React.ReactNode
}

export const PageLayout = ({
    title,
    backButtonEnabled = false,
    actionButton,
    actionButtonPermissions = [],
    rightBlock,
    onRefreshClick,
    isLoading,
    children,
}: PageLayoutProps) => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col p-7 w-full">
            <div className="flex justify-between items-start mb-10">
                <div className="flex items-center justify-start font-[700] font-pop text-[28px] gap-3">
                    {backButtonEnabled && (
                        <Button
                            className="text-foreground"
                            variant={'link'}
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft />
                        </Button>
                    )}
                    <p>{title}</p>
                    {getPermissionValue(actionButtonPermissions) &&
                        actionButton}
                    {typeof onRefreshClick !== 'undefined' && (
                        <RefreshButton
                            onClick={onRefreshClick}
                            isLoading={isLoading}
                        />
                    )}
                </div>
                {rightBlock}
            </div>
            {children}
        </div>
    )
}
