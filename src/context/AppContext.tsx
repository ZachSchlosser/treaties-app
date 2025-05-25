import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Treaty, AppState } from '../types';
import { StorageService } from '../services/storage';

interface AppContextType extends AppState {
  loadTreaties: () => Promise<void>;
  saveTreaty: (treaty: Treaty) => Promise<void>;
  deleteTreaty: (id: string) => Promise<void>;
  selectTreaty: (id: string) => void;
  createNewTreaty: () => Treaty;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [treaties, setTreaties] = useState<Treaty[]>([]);
  const [selectedTreatyId, setSelectedTreatyId] = useState<string | undefined>();

  useEffect(() => {
    loadTreaties();
  }, []);

  const loadTreaties = async () => {
    const loadedTreaties = await StorageService.getTreaties();
    setTreaties(loadedTreaties);
  };

  const saveTreaty = async (treaty: Treaty) => {
    await StorageService.saveTreaty(treaty);
    await loadTreaties();
  };

  const deleteTreaty = async (id: string) => {
    await StorageService.deleteTreaty(id);
    await loadTreaties();
    if (selectedTreatyId === id) {
      setSelectedTreatyId(undefined);
    }
  };

  const selectTreaty = (id: string) => {
    setSelectedTreatyId(id);
  };

  const createNewTreaty = (): Treaty => {
    const now = new Date().toISOString();
    return {
      id: `treaty_${Date.now()}`,
      content: '',
      metadata: {
        createdAt: now,
        lastModified: now
      }
    };
  };

  const value: AppContextType = {
    treaties,
    selectedTreatyId,
    loadTreaties,
    saveTreaty,
    deleteTreaty,
    selectTreaty,
    createNewTreaty
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
