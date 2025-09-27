import { TableCell, TableRow } from "../ui/table";
import EmptyState from "../empty/EmptyState";
import { GrTransaction } from "react-icons/gr";

interface EmptyTableProps {
    colspan?: number;
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

function EmptyTable({
    colspan = 4,
    title,
    description,
    icon = <GrTransaction size={32} className="text-gray-400" />,
}: EmptyTableProps) {
    return (
        <TableRow>
            <TableCell colSpan={colspan} className="px-6 py-10">
                <EmptyState
                    icon={icon}
                    title={title}
                    description={description}
                />
            </TableCell>
        </TableRow>
    );
}

export default EmptyTable;
