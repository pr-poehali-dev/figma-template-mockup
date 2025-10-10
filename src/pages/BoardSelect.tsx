import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';

interface Board {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
}

const BoardSelect = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([
    { id: '1', name: 'Моя доска', description: '', isFavorite: true },
    { id: '2', name: 'Моя доска', description: '', isFavorite: false },
  ]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: '', description: '', uniqueId: '', password: '' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinData, setJoinData] = useState({ uniqueId: '', password: '' });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{"email":"ivanov@mail.ru"}');

  const filteredBoards = showFavoritesOnly 
    ? boards.filter(b => b.isFavorite) 
    : boards;

  const handleCreateBoard = () => {
    const board: Board = {
      id: Date.now().toString(),
      name: newBoard.name || 'Моя доска',
      description: newBoard.description,
      isFavorite: false,
    };
    setBoards([...boards, board]);
    setNewBoard({ name: '', description: '', uniqueId: '', password: '' });
    setIsCreateOpen(false);
  };

  const handleJoinBoard = () => {
    setIsJoinOpen(false);
    setJoinData({ uniqueId: '', password: '' });
  };

  const toggleFavorite = (id: string) => {
    setBoards(boards.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className={`text-sm ${!showFavoritesOnly ? 'font-semibold' : 'text-gray-600'}`}
              >
                Все
              </button>
              <button
                onClick={() => setShowFavoritesOnly(true)}
                className={`text-sm ${showFavoritesOnly ? 'font-semibold' : 'text-gray-600'}`}
              >
                Только избранные
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Icon name="Link" size={16} />
                    Присоединиться к доске
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Присоединиться к доске</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Уникальный идентификатор</Label>
                      <Input
                        value={joinData.uniqueId}
                        onChange={(e) => setJoinData({ ...joinData, uniqueId: e.target.value })}
                        placeholder="1234112312"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Пароль</Label>
                      <Input
                        type="password"
                        value={joinData.password}
                        onChange={(e) => setJoinData({ ...joinData, password: e.target.value })}
                        placeholder="*************"
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleJoinBoard} className="w-full bg-purple-600 hover:bg-purple-700">
                      Присоединиться
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <PopoverTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors">
                    <Icon name="User" size={20} className="text-gray-600" />
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
          </div>

          {showFavoritesOnly && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm mb-3">
                <Icon name="Star" size={16} />
                <span className="font-medium">Избранные</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Все доски</h3>
            <div className="grid grid-cols-3 gap-3">
              {filteredBoards.map(board => (
                <Card
                  key={board.id}
                  onClick={() => navigate(`/board/${board.id}`)}
                  className="relative bg-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow h-24 flex flex-col justify-between"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(board.id);
                    }}
                    className="absolute top-2 right-2"
                  >
                    <Icon 
                      name="Star" 
                      size={16} 
                      className={board.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                    />
                  </button>
                  <span className="text-sm font-medium">{board.name}</span>
                </Card>
              ))}

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Card className="bg-gray-300 p-4 cursor-pointer hover:bg-gray-400 transition-colors h-24 flex items-center justify-center">
                    <Icon name="Plus" size={32} className="text-gray-600" />
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создать доску</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Название</Label>
                      <Input
                        value={newBoard.name}
                        onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                        placeholder="Что нужно сделать?"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Описание</Label>
                      <Textarea
                        value={newBoard.description}
                        onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                        placeholder="Добавьте детали..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Уникальный идентификатор</Label>
                      <Input
                        value={newBoard.uniqueId}
                        onChange={(e) => setNewBoard({ ...newBoard, uniqueId: e.target.value })}
                        placeholder="не обязательно для заполнения"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">не обязательно для заполнения</p>
                    </div>
                    <div>
                      <Label>Пароль</Label>
                      <Input
                        type="password"
                        value={newBoard.password}
                        onChange={(e) => setNewBoard({ ...newBoard, password: e.target.value })}
                        placeholder="не обязательно для заполнения"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">не обязательно для заполнения</p>
                    </div>
                    <Button onClick={handleCreateBoard} className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
                      <Icon name="Plus" size={16} />
                      Создать
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardSelect;
