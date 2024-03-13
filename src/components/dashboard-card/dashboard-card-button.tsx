export default function DashboardCardButton({ icon, onClick }: { icon: JSX.Element, onClick: () => void }) {
    return (
        <div className={`
            border
            rounded-full
            bg-white
            h-11 w-11
            flex items-center justify-center
            cursor-pointer
        `} onClick={onClick}>
            {icon}
        </div>
    )
}