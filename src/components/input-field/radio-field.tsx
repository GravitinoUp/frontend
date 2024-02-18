import { cn } from '@/lib/utils.ts'

interface RadioFieldProps {
    value: string
    label: string
    onChange: (value: string) => void
    selectedValue: string
}
export const RadioField = ({ selectedValue, value, label, onChange }: RadioFieldProps) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                className="hidden"
                value={value}
                checked={selectedValue === value}
                onChange={() => onChange(value)}
            />
            <span className={cn(selectedValue === value
                    ? 'bg-[#3F434A] text-background'
                    : 'bg-background text-[#3F434A]',
                'flex justify-center font-normal text-xs items-center py-2 px-5 w-28 h-8 rounded-xl border-2 border-[#E8E9EB] hover:bg-[#3F434A] hover:text-background',
            )}>{label}</span>
        </label>
    );
};