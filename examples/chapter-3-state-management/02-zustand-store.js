// examples/chapter-3-state-management/02-zustand-store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Basic Zustand store
export const useCounterStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
}));

// Todo store with actions
export const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  
  // Actions
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }]
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  
  updateTodo: (id, text) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    )
  })),
  
  setFilter: (filter) => set({ filter }),
  
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.completed)
  })),
  
  // Computed values
  getFilteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },
  
  getStats: () => {
    const { todos } = get();
    return {
      total: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length
    };
  }
}));

// User store with persistence
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = {
            id: 1,
            name: credentials.username,
            email: credentials.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`
          };
          
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;
        
        set({ loading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);

// Shopping cart store
export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  
  // Actions
  addItem: (product, quantity = 1) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    
    return {
      items: [...state.items, { ...product, quantity }]
    };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),
  
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter(item => item.quantity > 0)
  })),
  
  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  // Computed values
  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getItemCount: (productId) => {
    const { items } = get();
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
}));

// Theme store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'theme-storage'
    }
  )
);

// Settings store
export const useSettingsStore = create(
  persist(
    (set) => ({
      settings: {
        notifications: true,
        sound: false,
        language: 'en',
        timezone: 'UTC'
      },
      
      updateSetting: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          [key]: value
        }
      })),
      
      resetSettings: () => set({
        settings: {
          notifications: true,
          sound: false,
          language: 'en',
          timezone: 'UTC'
        }
      })
    }),
    {
      name: 'settings-storage'
    }
  )
);
