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
  const [activeSection, setActiveSection] = useState('boards');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Создать дизайн главной страницы', description: 'Разработать макет в Figma', status: 'todo' },
    { id: '2', title: 'Настроить базу данных', description: 'PostgreSQL + миграции', status: 'doing' },
    { id: '3', title: 'Подключить авторизацию', description: 'JWT токены и OAuth', status: 'doing' },
    { id: '4', title: 'Написать документацию API', description: 'Swagger спецификация', status: 'done' },
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const menuItems = [
    { id: 'main', label: 'Главная', icon: 'Home' },
    { id: 'boards', label: 'Доски', icon: 'LayoutDashboard' },
    { id: 'projects', label: 'Проекты', icon: 'FolderKanban' },
    { id: 'team', label: 'Команда', icon: 'Users' },
    { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'doing', title: 'Doing', color: 'bg-yellow-500', tasks: tasks.filter(t => t.status === 'doing') },
    { id: 'done', title: 'Done', color: 'bg-green-500', tasks: tasks.filter(t => t.status === 'done') },
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

  const moveTask = (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <aside className="w-64 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">KANBAN BOARD</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id 
                  ? 'bg-[hsl(var(--sidebar-accent))] text-white' 
                  : 'hover:bg-[hsl(var(--sidebar-accent))]/50'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Доски</h2>
            <p className="text-sm text-slate-500 mt-1">Управление задачами и проектами</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[hsl(var(--trello-blue))] hover:bg-[hsl(var(--trello-blue))]/90">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить задачу
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая задача</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Название</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Введите название задачи"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Опишите задачу"
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddTask} className="w-full bg-[hsl(var(--trello-blue))]">
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="p-8 h-[calc(100vh-88px)] overflow-x-auto">
          <div className="flex gap-6 h-full">
            {columns.map(column => (
              <div key={column.id} className="kanban-column flex-shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-slate-700">{column.title}</h3>
                  <span className="ml-auto text-sm text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {column.tasks.map(task => (
                    <Card key={task.id} className="task-card group">
                      <h4 className="font-medium text-slate-900 mb-2">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {column.id !== 'todo' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveTask(task.id, column.id === 'done' ? 'doing' : 'todo')}
                              className="h-7 px-2"
                            >
                              <Icon name="ChevronLeft" size={14} />
                            </Button>
                          )}
                          {column.id !== 'done' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveTask(task.id, column.id === 'todo' ? 'doing' : 'done')}
                              className="h-7 px-2"
                            >
                              <Icon name="ChevronRight" size={14} />
                            </Button>
                          )}
                        </div>
                        <div className="ml-auto flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
