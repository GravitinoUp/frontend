export default function CountField({
    title,
    count,
    colorClassName,
}: {
    title: string
    count: number
    colorClassName: string
}) {
    return (
        <div className="flex flex-row items-center">
            <div
                className={`
                    ${colorClassName}
                    w-6 h-6
                    rounded-full
                `}
            >
                <p className="flex h-full justify-center items-center text-xs text-white font-semibold">
                    {count}
                </p>
            </div>
            <p className="mx-4">{title}</p>
        </div>
    )
}
