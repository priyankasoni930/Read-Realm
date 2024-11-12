import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Group } from "@/lib/types";

interface GroupListProps {
  groups: Group[];
  selectedGroupId: string | null;
  onGroupSelect: (group: Group) => void;
}

const GroupList = ({
  groups,
  selectedGroupId,
  onGroupSelect,
}: GroupListProps) => {
  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div
          key={group.id}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            selectedGroupId === group.id
              ? "bg-gray-700 text-gray-100"
              : "hover:bg-gray-700/50 text-gray-300"
          }`}
          onClick={() => onGroupSelect(group)}
        >
          <span className="font-medium">{group.name}</span>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
