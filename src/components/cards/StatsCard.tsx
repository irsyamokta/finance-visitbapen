import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value?: string | number;
    className?: string;
    iconBgClass?: string;
}

const StatCard: FC<StatCardProps> = ({
    icon,
    title,
    value,
    className,
    iconBgClass,
}) => {
    return (
        <div
            className={twMerge(
                "rounded-2xl border border-gray-200 bg-white p-5 md:p-8",
                className
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg text-gray-600">{title}</h1>
                    {value !== undefined && (
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{value}</h4>
                    )}
                </div>
                <div
                    className={twMerge(
                        "flex items-center justify-center w-16 h-16 rounded-xl",
                        iconBgClass ?? "bg-primary"
                    )}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
