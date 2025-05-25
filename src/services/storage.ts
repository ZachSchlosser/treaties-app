import AsyncStorage from '@react-native-async-storage/async-storage';
import { Treaty } from '../types';

const TREATIES_KEY = '@treaties_storage';

export const StorageService = {
  async getTreaties(): Promise<Treaty[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(TREATIES_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading treaties:', e);
      return [];
    }
  },

  async saveTreaties(treaties: Treaty[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(treaties);
      await AsyncStorage.setItem(TREATIES_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving treaties:', e);
    }
  },

  async saveTreaty(treaty: Treaty): Promise<void> {
    try {
      const treaties = await this.getTreaties();
      const index = treaties.findIndex(t => t.id === treaty.id);
      
      if (index >= 0) {
        treaties[index] = treaty;
      } else {
        treaties.push(treaty);
      }
      
      await this.saveTreaties(treaties);
    } catch (e) {
      console.error('Error saving treaty:', e);
    }
  },

  async deleteTreaty(id: string): Promise<void> {
    try {
      const treaties = await this.getTreaties();
      const filtered = treaties.filter(t => t.id !== id);
      await this.saveTreaties(filtered);
    } catch (e) {
      console.error('Error deleting treaty:', e);
    }
  }
};
