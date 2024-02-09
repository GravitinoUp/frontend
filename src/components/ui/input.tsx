import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    suffixIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, suffixIcon, ...props }, ref) => (
        <div className="flex border border-input rounded-xl">
            <input
                type={type}
                className={cn(
                    'w-full h-10 rounded-xl bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
            {suffixIcon}
        </div>
    )
)
Input.displayName = 'Input'

export { Input }
