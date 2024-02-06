import { Switch } from '@/components/ui/switch'

export function AlertsCard() {
    return (
        <>
            <div className=" flex items-center p-4 border-solid border-b-2">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Все уведомления
                    </p>
                </div>
                <Switch />
            </div>
            <div className=" flex items-center p-4 border-solid border-b-2">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Уведомление о новых задачах
                    </p>
                </div>
                <Switch />
            </div>
        </>
    )
}
