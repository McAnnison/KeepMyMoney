import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  INCOMES: '@keepmymoney_incomes',
  EXPENSES: '@keepmymoney_expenses',
  BUDGETS: '@keepmymoney_budgets'
};

export const StorageService = {
  // Save data
  async saveIncomes(incomes) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
    } catch (error) {
      console.error('Error saving incomes:', error);
    }
  },

  async saveExpenses(expenses) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  },

  async saveBudgets(budgets) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  },

  // Load data
  async loadIncomes() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INCOMES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading incomes:', error);
      return [];
    }
  },

  async loadExpenses() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  },

  async loadBudgets() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading budgets:', error);
      return [];
    }
  },

  // Clear all data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.INCOMES,
        STORAGE_KEYS.EXPENSES,
        STORAGE_KEYS.BUDGETS
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
