import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputProps extends ComponentPropsWithoutRef<'input'> {
    label?: string
    type?: string
    isRequired?: boolean
    className?: string
}

export const InputField = forwardRef<HTMLInputElement, InputProps>(
    function InputField(
        { type = 'text', label, isRequired = false, className, ...props },
        ref
    ) {
        return (
            <FormItem className={cn(className)}>
                {label && (
                    <FormLabel>
                        {label}
                        {isRequired && <span className="text-red-600"> *</span>}
                    </FormLabel>
                )}
                <FormControl>
                    <Input type={type} ref={ref} {...props} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )
    }
)
