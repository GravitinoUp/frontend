export default function DashboardTabsButton({ title, isSelected = false }: { title: string, isSelected?: boolean }) {
    return (
        <div className={`
            rounded-full
            ${isSelected && 'bg-base'}
        `}>
            <p className={`text-sm ${isSelected && 'text-white'} px-7 py-2`}>{title}</p>
        </div>)
}