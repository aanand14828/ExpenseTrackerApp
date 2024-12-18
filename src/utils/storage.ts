// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = '@transactions';
const CATEGORIES_KEY = '@categories';

export async function saveTransactions(transactions: any[]) {
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export async function loadTransactions(): Promise<any[]> {
  const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCategories(categories: { income: string[], expense: string[] }) {
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export async function loadCategories(): Promise<{ income: string[], expense: string[] }> {
  const data = await AsyncStorage.getItem(CATEGORIES_KEY);
  return data ? JSON.parse(data) : {
    income: ["Salary", "Freelance", "Investments"],
    expense: ["Food", "Transport", "Rent", "Shopping", "Utilities"]
  };
}