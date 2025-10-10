import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import { SortableTaskCard } from '@/components/SortableTaskCard';
import { TaskCard } from '@/components/TaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
}

const Board = () => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState('Название сайта хуяйта');
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"email":"ivanov@mail.ru"}');

  const [columns, setColumns] = useState<Column[]>([
    { id: 'col1', title: 'Название' },
    { id: 'col2', title: 'Название' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task1', title: 'Задача', description: '', columnId: 'col1' },
  ]);

  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const overColumn = columns.find(c => c.id === overId);
    if (overColumn) {
      setTasks(tasks.map(t => 
        t.id === activeId ? { ...t, columnId: overColumn.id } : t
      ));
      return;
    }

    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.columnId === overTask.columnId) {
      const columnTasks = tasks.filter(t => t.columnId === activeTask.columnId);
      const oldIndex = columnTasks.findIndex(t => t.id === activeId);
      const newIndex = columnTasks.findIndex(t => t.id === overId);
      
      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      const otherTasks = tasks.filter(t => t.columnId !== activeTask.columnId);
      setTasks([...otherTasks, ...reorderedColumnTasks]);
    }
  };

  const handleAddTask = (columnId: string) => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        columnId,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '' });
    }
  };

  const handleEditTask = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const column: Column = {
        id: `col-${Date.now()}`,
        title: newColumnTitle,
      };
      setColumns([...columns, column]);
      setNewColumnTitle('');
      setIsAddColumnOpen(false);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(c => c.id !== columnId));
    setTasks(tasks.filter(t => t.columnId !== columnId));
  };

  const handleEditColumnTitle = (columnId: string, newTitle: string) => {
    setColumns(columns.map(c => c.id === columnId ? { ...c, title: newTitle } : c));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 to-purple-700">
        <header className="bg-purple-700 px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-white hover:bg-white/20"
              onClick={() => navigate('/boards')}
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            
            {isEditingBoardName ? (
              <Input
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onBlur={() => setIsEditingBoardName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingBoardName(false)}
                className="h-8 w-64 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingBoardName(true)}
                className="text-white font-medium hover:bg-white/10 px-3 py-1 rounded"
              >
                {boardName}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 h-9 w-9"
            >
              <Icon name="HelpCircle" size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 h-9 w-9"
            >
              <Icon name="Bell" size={20} />
            </Button>
            
            <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <PopoverTrigger asChild>
                <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name="User" size={18} className="text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <Icon name="User" size={24} className="text-gray-600" />
                    </div>
                    <div className="text-sm font-medium">{user.email}</div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Уведомления
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Помощь
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Выйти
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full items-start">
            {columns.map(column => {
              const columnTasks = tasks.filter(t => t.columnId === column.id);
              
              return (
                <div key={column.id} className="flex-shrink-0 w-[280px]">
                  <div className="bg-white rounded-lg p-3 flex flex-col max-h-full">
                    <div className="flex items-center justify-between mb-3">
                      <Input
                        value={column.title}
                        onChange={(e) => handleEditColumnTitle(column.id, e.target.value)}
                        className="h-8 font-semibold border-none focus-visible:ring-1 px-2"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteColumn(column.id)}
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>

                    <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="flex-1 space-y-2 overflow-y-auto min-h-[100px]">
                        {columnTasks.map(task => (
                          <SortableTaskCard
                            key={task.id}
                            task={task}
                            onEdit={setEditingTask}
                            onDelete={handleDeleteTask}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 h-8 mt-2"
                          onClick={() => setNewTask({ title: '', description: '' })}
                        >
                          <Icon name="Plus" size={16} className="mr-1" />
                          <span className="text-sm">Добавить карточку</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Новая карточка</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label>Название</Label>
                            <Input
                              value={newTask.title}
                              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                              placeholder="Введите название"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Описание</Label>
                            <Textarea
                              value={newTask.description}
                              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                              placeholder="Добавьте описание"
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <Button
                            onClick={() => handleAddTask(column.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            Создать карточку
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}

            <div className="flex-shrink-0 w-[280px]">
              <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-12 justify-start text-white hover:bg-white/20 bg-white/10 rounded-lg"
                  >
                    <Icon name="Plus" size={18} className="mr-2" />
                    <span className="font-medium">Добавить еще одну колонку</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая колонка</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Название колонки</Label>
                      <Input
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        placeholder="Введите название"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleAddColumn}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Создать колонку
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>

        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать карточку</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleEditTask}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Сохранить
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;
