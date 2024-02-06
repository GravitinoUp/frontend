import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

const PlusButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => (
    <Button
        variant="outline"
        size="icon"
        className="bg-primary rounded-3xl flex items-center justify-center p-[7px] size-8"
        onClick={onClick}
        ref={ref}
        {...props}
    >
        <div className="">
            <Plus color="white" size={17} />
        </div>
    </Button>
))

PlusButton.displayName = 'PlusButton'

export default PlusButton
