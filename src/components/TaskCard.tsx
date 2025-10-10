import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <Card className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-move group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
          <p className="text-sm text-gray-800 flex-1">{task.title}</p>
        </div>
        {onEdit && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          >
            <Icon name="Pencil" size={12} />
          </Button>
        )}
      </div>
    </Card>
  );
};
