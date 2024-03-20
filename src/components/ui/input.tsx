import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    prefixIcon?: React.ReactNode
    suffixIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, prefixIcon, suffixIcon, ...props }, ref) => (
        <div
            className={cn(
                'flex border border-input rounded-xl input-outline',
                className
            )}
        >
            {prefixIcon}
            <input
                type={type}
                className="w-full h-10 rounded-xl bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-2 focus-within:ring-primary ring-offset-background"
                ref={ref}
                {...props}
            />
            {suffixIcon}
        </div>
    )
)
Input.displayName = 'Input'

export { Input }
