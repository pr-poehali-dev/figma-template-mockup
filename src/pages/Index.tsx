import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Task {
  id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Разработать API эндпоинты', description: 'REST API для авторизации', priority: 'high', status: 'todo' },
    { id: '2', title: 'Дизайн мобильной версии', description: 'Адаптивная верстка', priority: 'medium', status: 'doing' },
    { id: '3', title: 'Настроить CI/CD', description: 'GitHub Actions + Deploy', priority: 'low', status: 'doing' },
    { id: '4', title: 'Код-ревью PR#123', description: 'Проверить изменения', priority: 'medium', status: 'done' },
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as 'low' | 'medium' | 'high' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    { 
      id: 'todo', 
      title: 'Запланировано',
      icon: 'Circle',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      tasks: tasks.filter(t => t.status === 'todo') 
    },
    { 
      id: 'doing', 
      title: 'В работе',
      icon: 'Clock',
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100/50',
      tasks: tasks.filter(t => t.status === 'doing') 
    },
    { 
      id: 'done', 
      title: 'Завершено',
      icon: 'CheckCircle2',
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      tasks: tasks.filter(t => t.status === 'done') 
    },
  ];

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700',
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'todo'
      }]);
      setNewTask({ title: '', description: '', priority: 'medium' });
      setIsDialogOpen(false);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Icon name="Kanban" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TaskFlow</h1>
                <p className="text-xs text-slate-500">Управление проектами</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Icon name="Search" size={18} className="mr-2" />
              Поиск
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Новая задача
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Создать задачу</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 mt-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700">Название</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Что нужно сделать?"
                      className="mt-2 h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">Описание</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Добавьте детали..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">Приоритет</Label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <Button
                          key={p}
                          type="button"
                          variant={newTask.priority === p ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewTask({ ...newTask, priority: p })}
                          className={newTask.priority === p ? 'bg-purple-600' : ''}
                        >
                          {p === 'low' ? 'Низкий' : p === 'medium' ? 'Средний' : 'Высокий'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddTask} 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    <Icon name="Plus" size={18} className="mr-2" />
                    Создать задачу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="ghost" 
              size="icon"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Icon name="Bell" size={20} />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-shadow">
              У
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6">
          <div className="flex gap-5 h-full overflow-x-auto pb-4">
            {columns.map(column => (
              <div 
                key={column.id} 
                className="flex-shrink-0 w-[340px] flex flex-col"
              >
                <div className={`bg-gradient-to-br ${column.bgGradient} rounded-2xl p-4 flex flex-col h-full border border-white/60 shadow-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name={column.icon as any} size={18} className={column.color} />
                      <h3 className="font-semibold text-slate-800">{column.title}</h3>
                      <Badge variant="secondary" className="ml-1 bg-white/60 text-slate-700 text-xs">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7 hover:bg-white/60"
                    >
                      <Icon name="MoreHorizontal" size={16} className="text-slate-600" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
                    {column.tasks.map(task => (
                      <Card 
                        key={task.id} 
                        className="group bg-white hover:shadow-xl transition-all duration-300 border-slate-200/60 p-4 cursor-pointer hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-medium text-slate-900 text-sm leading-snug flex-1">
                            {task.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          {task.priority && (
                            <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                              {task.priority === 'low' ? 'Низкий' : task.priority === 'medium' ? 'Средний' : 'Высокий'}
                            </Badge>
                          )}
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white shadow-sm" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mt-3 text-slate-700 hover:bg-white/60 h-9"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    <span className="text-sm">Добавить карточку</span>
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex-shrink-0 w-[280px]">
              <Button 
                variant="ghost" 
                className="w-full h-14 justify-start text-slate-600 hover:bg-white/60 border-2 border-dashed border-slate-300 rounded-2xl hover:border-purple-400 hover:text-purple-600 transition-all"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                <span className="font-medium">Добавить колонку</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
