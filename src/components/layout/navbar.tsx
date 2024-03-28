import React, { Dispatch, SetStateAction } from 'react'
import i18next from '../../i18n.ts'
import * as routes from '../../routes.ts'
import MultiLink from '../links/multi-link.tsx'
import SidebarLink from '../links/nav-link.tsx'
import Watermark from '../watermark/watermark.tsx'
import ChartIcon from '@/assets/icons/Chart_alt.svg'
import CompassIcon from '@/assets/icons/Compass.svg'
import DashboardIcon from '@/assets/icons/darhboard_alt.svg'
import FilterIcon from '@/assets/icons/Filter.svg'
import FoldersGroupIcon from '@/assets/icons/Folders_group.svg'
import GroupIcon from '@/assets/icons/Group_add.svg'
import HomeIcon from '@/assets/icons/Home.svg'
import ParametersIcon from '@/assets/icons/Parameters.svg'
import RoadFinishIcon from '@/assets/icons/Road_finish.svg'
import TaskListIcon from '@/assets/icons/Status_list.svg'
import VectorIcon from '@/assets/icons/Vector.svg'
import { PermissionEnum } from '@/constants/permissions.enum.ts'
import { cn } from '@/lib/utils.ts'
import { getPermissionValue } from '@/utils/helpers.ts'

export interface SingleLink {
    type: string
    path: string
    title: string
    children: React.ReactNode
}

export interface MultiLink {
    type: string
    links: SingleLink[]
    title: string
    children: React.ReactNode
}

export interface NavbarProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function Navbar({ open, setOpen }: NavbarProps) {
    const links: (SingleLink | MultiLink | false)[] = [
        {
            type: 'single',
            path: routes.DASHBOARD,
            title: i18next.t('dashboard'),
            children: <DashboardIcon />,
        },
        getPermissionValue([
            PermissionEnum.OrderGetMy,
            PermissionEnum.OrderGet,
        ]) && {
            type: 'single',
            path: routes.TASK_LIST,
            title: i18next.t('tasks'),
            children: <TaskListIcon />,
        },
        getPermissionValue([PermissionEnum.ReportGet]) && {
            type: 'single',
            path: routes.REPORTS,
            title: i18next.t('reports'),
            children: <ChartIcon />,
        },
        getPermissionValue([PermissionEnum.CheckpointGet]) && {
            type: 'single',
            path: routes.MAP,
            title: i18next.t('maps'),
            children: <CompassIcon />,
        },
        getPermissionValue([PermissionEnum.UserGet]) && {
            type: 'single',
            path: routes.USERS,
            title: i18next.t('users'),
            children: <GroupIcon />,
        },
        getPermissionValue([
            PermissionEnum.OrganizationGet,
            PermissionEnum.OrganizationGetMy,
        ]) && {
            type: 'single',
            path: routes.ORGANIZATIONS,
            title: i18next.t('organizations'),
            children: <HomeIcon />,
        },
        getPermissionValue([
            PermissionEnum.CheckpointGet,
            PermissionEnum.CheckpointGetMy,
        ]) && {
            type: 'single',
            path: routes.CHECKPOINTS,
            title: i18next.t('checkpoints'),
            children: <RoadFinishIcon />,
        },
        getPermissionValue([PermissionEnum.BranchGet]) && {
            type: 'single',
            path: routes.BRANCHES,
            title: i18next.t('branches'),
            children: <FoldersGroupIcon />,
        },
        getPermissionValue([PermissionEnum.RoleGet]) && {
            type: 'single',
            path: routes.ROLES,
            title: i18next.t('roles'),
            children: <VectorIcon />,
        },
        getPermissionValue([PermissionEnum.PropertyGet]) && {
            type: 'single',
            path: routes.MANAGE_PROPERTIES,
            title: i18next.t('manage.properties'),
            children: <ParametersIcon />,
        },
        {
            type: 'single',
            path: routes.SETTINGS,
            title: i18next.t('administration'),
            children: <FilterIcon />,
        },
    ]

    return (
        <nav className="bg-white flex flex-col border-solid h-screen">
            {open ? (
                <div
                    className={cn(
                        'h-[64px] w-[270px] py-2 flex justify-center'
                    )}
                >
                    <img
                        src="src/assets/images/rosgranstroy-logo-main.png"
                        className="object-contain select-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </div>
            ) : (
                <div className="h-[64px] w-[75px] p-2 flex justify-center">
                    <img
                        src="src/assets/images/rosgranstroy-logo.png"
                        className="object-contain select-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </div>
            )}
            <ul>
                {links.map((item, key) => {
                    if (item !== false) {
                        if (item.type === 'single') {
                            const link = item as SingleLink

                            return (
                                <li key={key}>
                                    <SidebarLink
                                        open={open}
                                        path={link.path}
                                        title={link.title}
                                    >
                                        {link.children}
                                    </SidebarLink>
                                </li>
                            )
                        }

                        if (item.type === 'multi') {
                            const links = item as MultiLink

                            return (
                                <li key={key}>
                                    <MultiLink
                                        links={links.links}
                                        open={open}
                                        setOpen={setOpen}
                                        title={links.title}
                                    >
                                        {links.children}
                                    </MultiLink>
                                </li>
                            )
                        }
                    }
                    return void 0
                })}
            </ul>
            <div
                className={cn(
                    'absolute w-full flex justify-center bottom-0 text-nowrap',
                    !open && 'invisible'
                )}
            >
                <Watermark />
            </div>
        </nav>
    )
}
