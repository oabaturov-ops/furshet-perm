'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface CompositionItem {
  id: string;
  name: string;
  quantity: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  image2: string;
  sortOrder: number;
  composition: CompositionItem[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

interface MenuData {
  categories: Category[];
  dishes: Dish[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'dishes' | 'categories' | 'orders'>('dishes');
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDishModal, setShowDishModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'dish' | 'category'; id: string } | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState('');
  const [uploadedImage2, setUploadedImage2] = useState('');
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Dish form state
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    image2: '',
    sortOrder: '0',
  });
  const [composition, setComposition] = useState<CompositionItem[]>([]);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sortOrder: '0',
  });

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      const [catRes, dishRes] = await Promise.all([
        fetch('/api/menu/categories'),
        fetch('/api/menu/dishes'),
      ]);
      if (catRes.ok && dishRes.ok) {
        const categories = await catRes.json();
        const dishes = await dishRes.json();
        setMenuData({ categories, dishes });
      }
      const orderRes = await fetch('/api/orders');
      if (orderRes.ok) setOrders(await orderRes.json());
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenu();
    }
  }, [isAuthenticated, fetchMenu]);
    useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetch('/api/orders').then(r => r.json()).then(newOrders => {
        const prevNew = orders.filter(o => o.status === 'new').length;
        const currNew = newOrders.filter((o: any) => o.status === 'new').length;
        if (currNew > prevNew) showNotification('success', `Новый заказ! (${currNew} новых)`);
        setOrders(newOrders);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, orders, showNotification]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Неверный пароль');
      }
    } catch {
      setAuthError('Ошибка подключения');
    }
  };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/menu/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedImage(data.url);
        setDishForm((prev) => ({ ...prev, image: data.url }));
        showNotification('success', 'Фото загружено');
      } else {
        showNotification('error', 'Ошибка загрузки фото');
      }
    } catch {
      showNotification('error', 'Ошибка загрузки фото');
    }
  };

  const handleImageUpload2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/menu/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setUploadedImage2(data.url);
        setDishForm((prev) => ({ ...prev, image2: data.url }));
        showNotification('success', 'Второе фото загружено');
      } else {
        showNotification('error', 'Ошибка загрузки фото');
      }
    } catch {
      showNotification('error', 'Ошибка загрузки фото');
    }
  };

  const addCompositionItem = () => {
    setComposition((prev) => [
      ...prev,
      { id: `ci-${Date.now()}`, name: '', quantity: '' },
    ]);
  };

  const removeCompositionItem = (id: string) => {
    setComposition((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCompositionItem = (id: string, field: 'name' | 'quantity', value: string) => {
    setComposition((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

    const openDishModal = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      setDishForm({
        name: dish.name,
        description: dish.description,
        price: String(dish.price),
        categoryId: dish.categoryId,
        image: dish.image || '',
        image2: (dish as any).image2 || '',
        sortOrder: String(dish.sortOrder),
      });
      setComposition(dish.composition || []);
      setUploadedImage(dish.image || '');
      setUploadedImage2((dish as any).image2 || '');
    } else {
      setEditingDish(null);
      setDishForm({ name: '', description: '', price: '', categoryId: menuData?.categories[0]?.id || '', image: '', image2: '', sortOrder: '0' });
      setComposition([]);
      setUploadedImage('');
      setUploadedImage2('');
    }
    setShowDishModal(true);
  };

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description,
        sortOrder: String(category.sortOrder),
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', sortOrder: '0' });
    }
    setShowCategoryModal(true);
  };

  const saveDish = async () => {
    if (!dishForm.name || !dishForm.price) {
      showNotification('error', 'Заполните название и цену');
      return;
    }
    try {
      const url = editingDish ? `/api/menu/dishes/${editingDish.id}` : '/api/menu/dishes';
      const method = editingDish ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dishForm,
          price: Number(dishForm.price),
          sortOrder: Number(dishForm.sortOrder),
          composition: composition.filter((c) => c.name.trim()),
        }),
      });
      if (res.ok) {
        showNotification('success', editingDish ? 'Блюдо обновлено' : 'Блюдо создано');
        setShowDishModal(false);
        fetchMenu();
      } else {
        showNotification('error', 'Ошибка сохранения блюда');
      }
    } catch {
      showNotification('error', 'Ошибка сохранения блюда');
    }
  };

  const saveCategory = async () => {
    if (!categoryForm.name) {
      showNotification('error', 'Заполните название категории');
      return;
    }
    try {
      const url = editingCategory ? `/api/menu/categories/${editingCategory.id}` : '/api/menu/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
          sortOrder: Number(categoryForm.sortOrder),
        }),
      });
      if (res.ok) {
        showNotification('success', editingCategory ? 'Категория обновлена' : 'Категория создана');
        setShowCategoryModal(false);
        fetchMenu();
      } else {
        showNotification('error', 'Ошибка сохранения категории');
      }
    } catch {
      showNotification('error', 'Ошибка сохранения категории');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const url =
        deleteConfirm.type === 'dish'
          ? `/api/menu/dishes/${deleteConfirm.id}`
          : `/api/menu/categories/${deleteConfirm.id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', deleteConfirm.type === 'dish' ? 'Блюдо удалено' : 'Категория удалена');
        setDeleteConfirm(null);
        fetchMenu();
      } else {
        showNotification('error', 'Не удалось удалить (возможно есть привязанные блюда)');
      }
    } catch {
      showNotification('error', 'Ошибка удаления');
    }
  };

  const getCategoryName = (catId: string) => menuData?.categories.find((c) => c.id === catId)?.name || catId;

  // ========== AUTH SCREEN ==========
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-sm border border-gray-800">
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#e53935' }}>
            ФУРШЕТ <span className="text-white">ПЕРМЬ</span>
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Панель администратора</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-[#e53935]"
            />
            {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: '#e53935' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========== ADMIN PANEL ==========
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#111] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: '#e53935' }}>
            ФУРШЕТ <span className="text-white">ПЕРМЬ</span>
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              На сайт
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'dishes'
                ? 'text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
            }`}
            style={activeTab === 'dishes' ? { backgroundColor: '#e53935' } : {}}
          >
            Блюда
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'categories'
                ? 'text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
            }`}
            style={activeTab === 'categories' ? { backgroundColor: '#e53935' } : {}}
          >
            Категории
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
            }`}
            style={activeTab === 'orders' ? { backgroundColor: '#e53935' } : {}}
          >
            Заказы {orders.length > 0 && `(${orders.filter(o => o.status === 'new').length})`}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-12">Загрузка...</p>
        ) : activeTab === 'dishes' ? (
          /* ===== DISHES TAB ===== */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Блюда</h2>
              <button
                onClick={() => openDishModal()}
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: '#e53935' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                + Добавить блюдо
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm">
                    <th className="text-left px-4 py-3">Фото</th>
                    <th className="text-left px-4 py-3">Название</th>
                    <th className="text-left px-4 py-3">Категория</th>
                    <th className="text-left px-4 py-3">Цена</th>
                    <th className="text-left px-4 py-3">Состав</th>
                    <th className="text-right px-4 py-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {menuData?.dishes.map((dish) => (
                    <tr key={dish.id} className="border-b border-gray-800/50 hover:bg-[#222]">
                      <td className="px-4 py-3">
                        {dish.image ? (
                          <img src={dish.image} alt={dish.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <div className="w-12 h-12 bg-[#333] rounded-lg flex items-center justify-center text-gray-500 text-xs">
                            Нет фото
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{dish.name}</div>
                        <div className="text-gray-400 text-xs mt-1 max-w-xs truncate">{dish.description}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{getCategoryName(dish.categoryId)}</td>
                      <td className="px-4 py-3 text-gray-300">{dish.price} ₽</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {dish.composition?.length ? dish.composition.map((c) => c.name).join(', ') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openDishModal(dish)}
                          className="text-blue-400 hover:text-blue-300 mr-3"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'dish', id: dish.id })}
                          className="text-red-400 hover:text-red-300"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!menuData?.dishes.length) && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Нет блюд. Добавьте первое блюдо.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'categories' ? (
          /* ===== CATEGORIES TAB ===== */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Категории</h2>
              <button
                onClick={() => openCategoryModal()}
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: '#e53935' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                + Добавить категорию
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuData?.categories.map((cat) => {
                const dishCount = menuData.dishes.filter((d) => d.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{cat.name}</h3>
                      <span className="text-gray-500 text-sm">#{cat.sortOrder}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{cat.description}</p>
                    <p className="text-gray-500 text-xs mb-4">Блюд: {dishCount}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openCategoryModal(cat)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'category', id: cat.id })}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })}
              {(!menuData?.categories.length) && (
                <p className="text-gray-500 col-span-full text-center py-8">Нет категорий</p>
              )}
            </div>
          </div>
        ) : (
          /* ===== ORDERS TAB ===== */
          <div>
            <h2 className="text-xl font-semibold mb-4">Заказы</h2>
            {!orders.length ? (
              <p className="text-gray-500 text-center py-12">Заказов пока нет</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o: any) => (
                  <div key={o.id} className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{o.customer_name}</span>
                        <span className="text-gray-400 text-sm ml-3">{o.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString('ru-RU')}</span>
                        <select
                          value={o.status}
                          onChange={async (e) => {
                            await fetch(`/api/orders/${o.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: e.target.value }) });
                            fetchMenu();
                          }}
                          className="bg-[#333] text-white text-xs rounded-lg px-2 py-1 border border-gray-700"
                        >
                          <option value="new">Новый</option>
                          <option value="cooking">Готовится</option>
                          <option value="delivery">Доставка</option>
                          <option value="done">Выполнен</option>
                        </select>
                        <button
                          onClick={async () => {
                            if (confirm('Удалить заказ?')) {
                              await fetch(`/api/orders/${o.id}`, { method: 'DELETE' });
                              fetchMenu();
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-xs ml-2"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                    {o.address && <p className="text-gray-400 text-sm mb-2">Адрес: {o.address}</p>}
                    <div className="text-sm text-gray-300 mb-1">
                      {o.items?.map((it: any, i: number) => (
                        <span key={i}>{it.name} x{it.quantity} — {it.price * it.quantity} ₽; </span>
                      ))}
                    </div>
                    <div className="text-right font-bold text-lg" style={{ color: '#e53935' }}>{o.total} ₽</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== DISH MODAL ===== */}
      {showDishModal && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{editingDish ? 'Редактировать блюдо' : 'Новое блюдо'}</h3>
              <button onClick={() => setShowDishModal(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Фото блюда</label>
                {uploadedImage && (
                  <img src={uploadedImage} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
                >
                  {uploadedImage ? 'Заменить фото' : 'Загрузить фото'}
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Второе фото блюда</label>
                {uploadedImage2 && (
                  <img src={uploadedImage2} alt="Preview 2" className="w-full h-40 object-cover rounded-lg mb-2" />
                )}
                <input
                  ref={fileInputRef2}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload2}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef2.current?.click()}
                  className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
                >
                  {uploadedImage2 ? 'Заменить второе фото' : 'Загрузить второе фото'}
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Название *</label>
                <input
                  value={dishForm.name}
                  onChange={(e) => setDishForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                  placeholder="Название блюда"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Описание</label>
                <textarea
                  value={dishForm.description}
                  onChange={(e) => setDishForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935] h-20 resize-none"
                  placeholder="Описание блюда"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Цена (руб) *</label>
                  <input
                    type="number"
                    value={dishForm.price}
                    onChange={(e) => setDishForm((p) => ({ ...p, price: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Категория</label>
                  <select
                    value={dishForm.categoryId}
                    onChange={(e) => setDishForm((p) => ({ ...p, categoryId: e.target.value }))}
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                  >
                    <option value="">Без категории</option>
                    {menuData?.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Порядок сортировки</label>
                <input
                  type="number"
                  value={dishForm.sortOrder}
                  onChange={(e) => setDishForm((p) => ({ ...p, sortOrder: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                  placeholder="0"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-400">Состав блюда</label>
                  <button
                    type="button"
                    onClick={addCompositionItem}
                    className="text-sm px-3 py-1 rounded-md text-white"
                    style={{ backgroundColor: '#e53935' }}
                  >
                    + Добавить
                  </button>
                </div>
                <div className="space-y-2">
                  {composition.map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-2 items-center">
                      <input
                        value={item.name}
                        onChange={(e) => updateCompositionItem(item.id, 'name', e.target.value)}
                        className="flex-1 bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#e53935]"
                        placeholder="Ингредиент"
                      />
                      <input
                        value={item.quantity}
                        onChange={(e) => updateCompositionItem(item.id, 'quantity', e.target.value)}
                        className="w-24 bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#e53935]"
                        placeholder="Кол-во"
                      />
                      <button
                        type="button"
                        onClick={() => removeCompositionItem(item.id)}
                        className="text-red-400 hover:text-red-300 px-2"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowDishModal(false)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveDish}
                className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: '#e53935' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                {editingDish ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CATEGORY MODAL ===== */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Название *</label>
                <input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                  placeholder="Название категории"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Описание</label>
                <input
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                  placeholder="Описание категории"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Порядок сортировки</label>
                <input
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, sortOrder: e.target.value }))}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e53935]"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveCategory}
                className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: '#e53935' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                {editingCategory ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION ===== */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Удалить?</h3>
            <p className="text-gray-400 mb-6">
              Вы уверены, что хотите удалить этот {deleteConfirm.type === 'dish' ? 'блюдо' : 'категорию'}?
              {deleteConfirm.type === 'category' && ' Все блюда в этой категории будут без категории.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: '#e53935' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53935')}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}