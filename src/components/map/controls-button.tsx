export default function ControlsButton({ children, onClick }: { onClick: () => void, children: React.ReactNode }) {
    return (
        <div className="p-2" onClick={onClick} >
            {children}
        </div>
    )
}