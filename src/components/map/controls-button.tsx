export default function ControlsButton({ children, onClick }: { onClick: () => void, children: React.ReactNode }) {
    return (
        <div className="px-2 py-3" onClick={onClick} >
            {children}
        </div>
    )
}