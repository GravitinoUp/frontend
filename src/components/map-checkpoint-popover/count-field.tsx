import CircularBar from "../circular-bar/circular-bar"

export default function CountField({
    title,
    value,
}: {
    title: string
    value: number,
}) {
    return (
        <div className="flex flex-row items-center">
            <CircularBar value={value} />
            <p className="mx-4">{title}, %</p>
        </div>
    )
}
