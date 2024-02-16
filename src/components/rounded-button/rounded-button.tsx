export default function RoundedButton({ icon, onClick }: { icon: JSX.Element, onClick: () => void }) {
    return (
        <div className='p-3 bg-muted rounded-full cursor-pointer flex items-center w-11 h-11' onClick={() => onClick}>
            {icon}
        </div>
    )
}