import React from 'react'
import i18next from 'i18next'
import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import FilterIcon from '@/assets/icons/filter_icon.svg'

type Props = {
    value: string | number
    placeholder?: string
    onChange: (value: string | number) => void
    debounce?: number
    suffixIconClick?: () => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export const DebouncedInput: React.FC<Props> = ({
    value: initialValue,
    placeholder = i18next.t('placeholder.search'),
    onChange,
    debounce = 500,
    suffixIconClick,
    ...props
}) => {
    const [value, setValue] = React.useState<number | string>(initialValue)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setValue(event.target.value)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="w-full h-[37px] border-solid border-[1px] rounded-xl flex items-center justify-start mb-4 overflow-hidden">
            <div className="ml-3 mr-3">
                <Search color="#8A9099" size={20} />
            </div>
            <div className="flex-auto ">
                <input
                    className="w-full focus:outline-none bg-transparent"
                    {...props}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                />
            </div>
            {suffixIconClick && (
                <Button
                    variant={'ghost'}
                    className="px-4 rounded-none"
                    onClick={suffixIconClick}
                >
                    <FilterIcon />
                </Button>
            )}
        </div>
    )
}

export default DebouncedInput
