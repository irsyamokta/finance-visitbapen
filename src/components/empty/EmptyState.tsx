import { GrTransaction } from "react-icons/gr";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = <GrTransaction size={32} className="text-gray-400" />,
    title,
    description
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3">{icon}</div>
            <h3 className="text-lg font-medium text-gray-500">{title}</h3>
            {description && (
                <p className="text-sm text-gray-400">{description}</p>
            )}
        </div>
    );
};

export default EmptyState;
