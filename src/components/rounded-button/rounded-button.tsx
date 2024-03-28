import React from 'react'

const RoundedButton = React.forwardRef<
    HTMLDivElement,
    { icon: JSX.Element; onClick: () => void }
>(({ icon, onClick }, ref) => (
    <div
        ref={ref}
        className="p-3 bg-muted rounded-full cursor-pointer flex items-center w-11 h-11"
        onClick={onClick}
    >
        {icon}
    </div>
))

RoundedButton.displayName = 'RoundedButton'

export default RoundedButton
