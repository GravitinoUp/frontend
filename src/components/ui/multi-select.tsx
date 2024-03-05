import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { X } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'

export type Option = Record<'value' | 'label', string | number>

interface MultiSelectProps {
    options: Option[]
    defaultOptions?: Option[]
    placeholder?: string
    disabled?: boolean
    onChange?: (values: Option[]) => void
    showItems?: boolean
}

export function MultiSelect({
    options,
    defaultOptions,
    placeholder,
    disabled,
    onChange,
    showItems = true,
}: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<Option[]>(
        defaultOptions ?? [],
    )
    const [inputValue, setInputValue] = React.useState('')
    const [allSelected, setAllSelected] = React.useState(false)
    const { t } = useTranslation()

    const handleUnselect = React.useCallback((option: Option) => {
        setSelected((prev) => prev.filter((s) => s.value !== option.value))
    }, [])

    const handleSelectAll = React.useCallback(() => {
        setSelected(options)
        setAllSelected(true)
    }, [options])

    const handleUnselectAll = React.useCallback(() => {
        setSelected([])
        setAllSelected(false)
    }, [])

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            e.stopPropagation()
            const input = inputRef.current
            if (input) {
                if (!showItems && e.key === 'Enter') {
                    if (input.value.trim() !== '') {
                        setSelected((prev) => {
                            const newSelected = [...prev]

                            if (
                                !prev.some(
                                    (v) => v.value === input.value.trim(),
                                )
                            ) {
                                newSelected.push({
                                    value: input.value,
                                    label: input.value,
                                })
                            }

                            return newSelected
                        })

                        setInputValue('')
                    }
                }

                if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (input.value === '') {
                        setSelected((prev) => {
                            const newSelected = [...prev]
                            newSelected.pop()
                            return newSelected
                        })
                    }
                }
                // This is not a default behaviour of the <input /> field
                if (e.key === 'Escape') {
                    input.blur()
                }
            }
        },
        [],
    )

    const selectables = options.filter(
        (option) =>
            !selected.some(
                (item) => JSON.stringify(option) === JSON.stringify(item),
            ),
    )

    React.useEffect(() => {
        onChange?.(selected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    React.useEffect(() => {
        if (selected.length === 0) {
            setAllSelected(false)
        } else {
            setAllSelected(true)
        }
    }, [selected])

    React.useEffect(() => {
        if (disabled) {
            setOpen(false)
            setSelected([])
        }
    }, [disabled])

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div
                className="group border border-input rounded-xl px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring">
                <div className="flex gap-1 flex-wrap">
                    {selected.map((item) => (
                        <Badge key={item.value} variant="secondary">
                            {item.label}
                            <button
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUnselect(item)
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={() => handleUnselect(item)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => showItems && setOpen(false)}
                        onFocus={() => selectables.length > 0 && showItems && setOpen(true)}
                        placeholder={selected.length > 0 ? void 0 : placeholder}
                        disabled={disabled}
                        className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open ? (
                    <div
                        className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup className="h-full overflow-auto">
                            {options.length > 0 && (
                                <CommandItem
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onSelect={() => {
                                        if (allSelected) {
                                            handleUnselectAll()
                                        } else {
                                            handleSelectAll()
                                        }
                                        setInputValue('')
                                    }}
                                    className={'cursor-pointer'}
                                >
                                    {allSelected
                                        ? t('multiselect.unselect.all')
                                        : t('multiselect.select.all')}
                                </CommandItem>
                            )}
                            {selectables.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onSelect={() => {
                                        setInputValue('')
                                        setSelected((prev) => [...prev, item])
                                    }}
                                    className={'cursor-pointer'}
                                >
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </div>
                ) : null}
            </div>
        </Command>
    )
}
