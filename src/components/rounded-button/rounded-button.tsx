export default function RoundedButton({ icon, onClick }: { icon: JSX.Element, onClick: () => void }) {
    return (
        <div className='p-3 bg-muted rounded-full cursor-pointer' onClick={() => onClick}>
            {icon}
        </div>
    )
}