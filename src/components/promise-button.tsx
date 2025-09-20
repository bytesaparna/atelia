"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

interface PromiseButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => Promise<void> | void
    children: React.ReactNode
}

export function PromiseButton({
    onClick,
    children,
    className,
    ...props
}: PromiseButtonProps) {
    const [loading, setLoading] = React.useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)
            await onClick()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            {...props}
            disabled={loading || props.disabled}
            onClick={handleClick}
            className={cn("flex items-center gap-2", className)}
        >
            {loading && (
                <Loader2
                    className={cn("h-4 w-4 animate-spin text-emerald-400")}
                />
            )}
            {children}
        </Button>
    )
}
