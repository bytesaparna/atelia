import * as React from "react";
import { Clock } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface Duration {
    days: number;
    hours: number;
    minutes: number;
}

interface DurationSelectorProps {
    value?: Duration;
    onChange?: (duration: Duration) => void;
    placeholder?: string;
    className?: string;
}

export function DurationSelector({
    value,
    onChange,
    placeholder = "Select duration",
    className
}: DurationSelectorProps) {
    const [internalValue, setInternalValue] = React.useState<Duration>(
        value || { days: 0, hours: 1, minutes: 0 }
    );
    const [isOpen, setIsOpen] = React.useState(false);

    const handleDaysChange = (newValue: string) => {
        const numValue = Math.max(0, parseInt(newValue) || 0);
        const newDuration = { ...internalValue, days: numValue };
        setInternalValue(newDuration);
        onChange?.(newDuration);
    };

    const handleHoursChange = (newValue: string) => {
        const numValue = Math.max(0, Math.min(23, parseInt(newValue) || 0));
        const newDuration = { ...internalValue, hours: numValue };
        setInternalValue(newDuration);
        onChange?.(newDuration);
    };

    const handleMinutesChange = (newValue: string) => {
        const numValue = Math.max(0, Math.min(59, parseInt(newValue) || 0));
        const newDuration = { ...internalValue, minutes: numValue };
        setInternalValue(newDuration);
        onChange?.(newDuration);
    };

    const formatDuration = (duration: Duration) => {
        const parts = [];
        if (duration.days > 0) {
            parts.push(`${duration.days}d`);
        }
        if (duration.hours > 0) {
            parts.push(`${duration.hours}h`);
        }
        if (duration.minutes > 0) {
            parts.push(`${duration.minutes}m`);
        }
        return parts.length > 0 ? parts.join(' ') : '0m';
    };

    const getTotalMinutes = (duration: Duration) => {
        return duration.days * 24 * 60 + duration.hours * 60 + duration.minutes;
    };

    const isValidDuration = (duration: Duration) => {
        return getTotalMinutes(duration) > 0;
    };

    React.useEffect(() => {
        if (value) {
            setInternalValue(value);
        }
    }, [value]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal bg-background !border-border/50 hover:border-accent transition-colors",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className="mr-2 h-4 w-4 text-accent" />
                    {value ? formatDuration(value) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                    <div className="text-sm font-medium text-foreground">
                        Select Duration
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Days</Label>
                            <Input
                                type="number"
                                min="0"
                                max="365"
                                value={internalValue.days}
                                onChange={(e) => handleDaysChange(e.target.value)}
                                className="bg-background border-border/50 focus:border-accent text-center"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Hours</Label>
                            <Input
                                type="number"
                                min="0"
                                max="23"
                                value={internalValue.hours}
                                onChange={(e) => handleHoursChange(e.target.value)}
                                className="bg-background border-border/50 focus:border-accent text-center"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Minutes</Label>
                            <Input
                                type="number"
                                min="0"
                                max="59"
                                value={internalValue.minutes}
                                onChange={(e) => handleMinutesChange(e.target.value)}
                                className="bg-background border-border/50 focus:border-accent text-center"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                        {formatDuration(internalValue)}
                        {!isValidDuration(internalValue) && (
                            <span className="text-destructive block mt-1">
                                Duration must be greater than 0
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => setIsOpen(false)}
                            disabled={!isValidDuration(internalValue)}
                            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}