import React, { Dispatch, SetStateAction } from 'react'
import MultiLink from './links/multi-link.tsx'
import SidebarLink from './links/nav-link.tsx'
import i18next from '../i18n.ts'
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
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export interface SingleLink {
    type: string
    path: string
    title: string
    count: number | null
    children: React.ReactNode
}

export interface MultiLink {
    type: string
    links: SingleLink[]
    title: string
    children: React.ReactNode
}

const links: (SingleLink | MultiLink)[] = [
    {
        type: 'single',
        path: '/dashboard',
        title: i18next.t('dashboard'),
        count: null,
        children: <DashboardIcon />,
    },
    {
        type: 'single',
        path: '/tasklist',
        title: i18next.t('tasks'),
        count: null,
        children: <TaskListIcon />,
    },
    {
        type: 'single',
        path: '/reports',
        title: i18next.t('reports'),
        count: 9,
        children: <ChartIcon />,
    },
    {
        type: 'single',
        path: '/map',
        title: i18next.t('maps'),
        count: null,
        children: <CompassIcon />,
    },
    {
        type: 'single',
        path: '/users',
        title: i18next.t('users'),
        count: null,
        children: <GroupIcon />,
    },
    {
        type: 'single',
        path: '/organizations',
        title: i18next.t('organizations'),
        count: null,
        children: <HomeIcon />,
    },
    {
        type: 'single',
        path: '/checkpoints',
        title: i18next.t('checkpoints'),
        count: null,
        children: <RoadFinishIcon />,
    },
    {
        type: 'single',
        path: '/branches',
        title: i18next.t('branches'),
        count: null,
        children: <FoldersGroupIcon />,
    },
    {
        type: 'single',
        path: '/roles',
        title: i18next.t('roles'),
        count: null,
        children: <VectorIcon />,
    },
    {
        type: 'single',
        path: '/manage-properties',
        title: i18next.t('manage.properties'),
        count: null,
        children: <ParametersIcon />,
    },
    {
        type: 'single',
        path: '/administration',
        title: i18next.t('administration'),
        count: null,
        children: <FilterIcon />,
    },
]

export interface NavbarProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function Navbar({ open, setOpen }: NavbarProps) {
    const { t } = useTranslation()

    return (
        <div className="bg-white flex flex-col border-solid h-screen">
            <div
                className={cn(
                    'h-[64px] text-[#0784D1] text-nowrap items-center font-pop font-bold text-[18px] flex justify-center',
                    !open && 'invisible'
                )}
            >
                {t('gravitino.full.name')}
            </div>

            <ul>
                {links.map((item, key) => {
                    if (item.type === 'single') {
                        const link = item as SingleLink

                        return (
                            <li key={key}>
                                <SidebarLink
                                    open={open}
                                    count={link.count}
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
                    return void 0
                })}
            </ul>
        </div>
    )
}
