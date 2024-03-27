import i18next from '../../../i18n.ts'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const SKELETONS_DATA = [
    {
        id: crypto.randomUUID(),
        title: i18next.t('title'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('description'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('checkpoint'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('executor'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('priority'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('task.creator'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('branch'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('creation.date'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('end.date'),
    },
    {
        id: crypto.randomUUID(),
        title: i18next.t('task.type'),
    },
]

export const TaskInfoSkeleton = () => (
    <>
        <div className="flex justify-end">
            <Skeleton className="h-8 w-[100px] rounded-lg" />
        </div>
        <div className="flex">
            <div className="w-full mr-[100px]">
                {SKELETONS_DATA.slice(0, 5).map(({ id, title }) => (
                    <div key={id} className="pb-4">
                        <p className="font-medium text-foreground text-xl leading-8">
                            {title}
                        </p>
                        <div className="mt-6">
                            <Skeleton className="h-10 w-[300px] rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full mr-[100px]">
                {SKELETONS_DATA.slice(5).map(({ id, title }) => (
                    <div key={id} className="pb-4">
                        <p className="font-medium text-foreground text-xl leading-8">
                            {title}
                        </p>
                        <div className="mt-6">
                            <Skeleton className="h-10 w-[300px] rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <Skeleton className="mt-10 w-[400px] h-[115px] rounded-xl" />
        <div className="flex gap-4 mt-16">
            <Button className="px-8" disabled>
                {i18next.t('button.action.change.status')}
            </Button>
            <Button className="px-8" variant="outline" disabled>
                {i18next.t('feedback.attach.images')}
            </Button>
        </div>
    </>
)
