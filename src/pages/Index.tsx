import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'sdfassfd', description: '', status: 'todo' },
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      bgColor: 'bg-[#C8E6C9]',
      tasks: tasks.filter(t => t.status === 'todo') 
    },
    { 
      id: 'doing', 
      title: 'Doing', 
      bgColor: 'bg-[#FFF9C4]',
      tasks: tasks.filter(t => t.status === 'doing') 
    },
    { 
      id: 'done', 
      title: 'Done', 
      bgColor: 'bg-[#EEEEEE]',
      tasks: tasks.filter(t => t.status === 'done') 
    },
  ];

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: 'todo'
      }]);
      setNewTask({ title: '', description: '' });
      setIsDialogOpen(false);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0079BF]">
      <header className="bg-[#026AA7] px-4 py-2 flex items-center justify-between border-b border-black/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-semibold text-lg">test-kanban</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 h-8 px-2"
            >
              <Icon name="Star" size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 h-8 px-2"
            >
              <Icon name="Users" size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 h-8 px-2 gap-1"
            >
              <Icon name="LayoutDashboard" size={16} />
              <span className="text-sm">Board</span>
              <Icon name="ChevronDown" size={14} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 h-8 px-3"
          >
            <Icon name="Zap" size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 h-8 px-3"
          >
            <Icon name="Filter" size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 h-8 px-3"
          >
            <Icon name="User" size={16} />
          </Button>
          <Button 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white h-8 px-3 gap-1"
          >
            <Icon name="Share2" size={16} />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 h-8 px-2"
          >
            <Icon name="MoreHorizontal" size={16} />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-3">
        <div className="flex gap-3 h-full items-start">
          {columns.map(column => (
            <div key={column.id} className={`kanban-column ${column.bgColor} flex flex-col`}>
              <div className="flex items-center justify-between px-2 py-2 mb-1">
                <h3 className="font-semibold text-sm text-gray-800">{column.title}</h3>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-black/10"
                  >
                    <Icon name="MoreHorizontal" size={14} />
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-2 px-2 overflow-y-auto">
                {column.tasks.map(task => (
                  <Card key={task.id} className="task-card group relative">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 flex-1">{task.title}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                      >
                        <Icon name="Pencil" size={12} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 hover:bg-black/10 h-8 mt-1"
                  >
                    <Icon name="Plus" size={16} className="mr-1" />
                    <span className="text-sm">Add a card</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая карточка</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Название</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Введите название"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Добавьте описание"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleAddTask} 
                      className="w-full bg-[#0079BF] hover:bg-[#026AA7]"
                    >
                      Создать карточку
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}

          <div className="min-w-[280px]">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/20 h-10 bg-white/10"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              <span className="text-sm font-medium">Add another list</span>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-[#026AA7] px-4 py-2 flex items-center justify-center gap-6 border-t border-black/10">
        <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 h-8 gap-2">
          <Icon name="Inbox" size={16} />
          <span className="text-sm">Inbox</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 h-8 gap-2">
          <Icon name="Calendar" size={16} />
          <span className="text-sm">Planner</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 gap-2 bg-white/10">
          <Icon name="LayoutDashboard" size={16} />
          <span className="text-sm">Board</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 h-8 gap-2">
          <Icon name="Rows" size={16} />
          <span className="text-sm">Switch boards</span>
        </Button>
      </footer>
    </div>
  );
};

export default Index;
