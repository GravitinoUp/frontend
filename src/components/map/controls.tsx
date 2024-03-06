import { MinusIcon, PlusIcon } from "lucide-react";
import ControlsButton from "./controls-button";
import { cn } from "@/lib/utils";

export default function Controls({ className, onPlusClick, onMinusClick }: { className?: string, onPlusClick: () => void, onMinusClick: () => void }) {
    return (
        <div className={cn("absolute bg-white rounded-xl z-10 border", className)}>
            <ControlsButton onClick={onPlusClick}>
                <PlusIcon />
            </ControlsButton>
            <div className="w-auto bg-border h-[2px] mx-[3px]" />
            <ControlsButton onClick={onMinusClick}>
                <MinusIcon />
            </ControlsButton>
        </div>
    )
}