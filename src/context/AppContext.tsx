// src/context/AppContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { loadTransactions, saveTransactions, loadCategories, saveCategories } from '../utils/storage';
import { scheduleNotification } from '../utils/notifications';
import { autoCategorize } from '../utils/autoCategorize'; // a helper function we will create
import { startOfMonth } from 'date-fns';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note?: string;
  date: string;
}

interface Categories {
  income: string[];
  expense: string[];
}

interface RecurringTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note?: string;
  recurrence: 'monthly' | 'yearly'; 
  // Could store next due date or just rely on month changes
}

// New: Budgets structure (category-based monthly budgets)
interface Budgets {
  [category: string]: number; // e.g. {"Food": 300, "Rent": 1000}
}

// New: App-level state for budgets, goals, recurring transactions, etc.
interface AppContextType {
  transactions: Transaction[];
  categories: Categories;
  budgets: Budgets;
  savingsGoal: number;
  recurringTransactions: RecurringTransaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updated: Partial<Transaction>) => void;
  addCategory: (type: 'income' | 'expense', category: string) => void;
  setBudget: (category: string, amount: number) => void;
  setSavingsGoal: (goal: number) => void;
  addRecurringTransaction: (rt: RecurringTransaction) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  checkAndInsertRecurring: () => void;
  checkBudgetsAndNotify: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categories>({ income: [], expense: [] });
  const [budgets, setBudgets] = useState<Budgets>({});
  const [savingsGoal, setSavingsGoalState] = useState<number>(1000); // default goal
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);

  useEffect(() => {
    (async () => {
      const storedTransactions = await loadTransactions();
      setTransactions(storedTransactions);

      const storedCategories = await loadCategories();
      setCategories(storedCategories);

      // On startup, check if we need to insert recurring transactions (monthly event)
      checkAndInsertRecurring();

      // Check budgets for any categories nearing limit
      checkBudgetsAndNotify();
    })();
  }, []);

  const addTransaction = async (transaction: Transaction) => {
    // Auto-categorize if category not chosen or implement logic
    if (!transaction.category || transaction.category === '') {
      const guessedCategory = autoCategorize(transaction.note || '', categories);
      if (guessedCategory) {
        transaction.category = guessedCategory;
      }
    }

    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    await saveTransactions(newTransactions);
    checkBudgetsAndNotify();
  };

  const deleteTransaction = async (id: string) => {
    const newTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(newTransactions);
    await saveTransactions(newTransactions);
  };

  const updateTransaction = async (id: string, updated: Partial<Transaction>) => {
    const newTransactions = transactions.map((t) => (t.id === id ? { ...t, ...updated } : t));
    setTransactions(newTransactions);
    await saveTransactions(newTransactions);
    checkBudgetsAndNotify();
  };

  const addCategory = async (type: 'income' | 'expense', category: string) => {
    const newCategories = { ...categories };
    newCategories[type].push(category);
    setCategories(newCategories);
    await saveCategories(newCategories);
  };

  const setBudget = (category: string, amount: number) => {
    setBudgets((prev) => ({ ...prev, [category]: amount }));
  };

  const setSavingsGoal = (goal: number) => {
    setSavingsGoalState(goal);
  };

  const addRecurringTransaction = (rt: RecurringTransaction) => {
    setRecurringTransactions((prev) => [...prev, rt]);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  const checkAndInsertRecurring = () => {
    // This logic would typically run once a month (e.g., check if month has changed since last run)
    // For simplicity, run at startup:
    const now = new Date();
    const firstOfMonth = startOfMonth(now).toISOString();
    // A more sophisticated approach: store last run date in AsyncStorage and compare

    // Insert monthly recurring transactions
    const monthly = recurringTransactions.filter(r => r.recurrence === 'monthly');
    // For each, add it if not already added this month (you would track last insertion)
    // This is simplified; you'd need logic to ensure duplicates aren’t inserted every startup.
    monthly.forEach(rt => {
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        type: rt.type,
        category: rt.category,
        amount: rt.amount,
        note: rt.note,
        date: new Date().toISOString()
      };
      addTransaction(transaction);
    });

    // Notify about upcoming bills
    monthly.forEach(rt => {
      scheduleNotification("Bill Reminder", `Your ${rt.category} bill is due this month.`, { seconds: 5 });
    });
  };

  const checkBudgetsAndNotify = () => {
    // Check if any category spending is above 90% of budget
    for (const category of Object.keys(budgets)) {
      const catBudget = budgets[category];
      if (catBudget && catBudget > 0) {
        const catSpending = transactions
          .filter(t => t.type === 'expense' && t.category === category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        if (catSpending >= catBudget * 0.9 && catSpending < catBudget) {
          scheduleNotification("Budget Alert", `You are nearing your budget limit for ${category}.`);
        }
      }
    }
  };

  return (
    <AppContext.Provider value={{
      transactions,
      categories,
      budgets,
      savingsGoal,
      recurringTransactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addCategory,
      setBudget,
      setSavingsGoal,
      addRecurringTransaction,
      totalIncome,
      totalExpense,
      balance,
      checkAndInsertRecurring,
      checkBudgetsAndNotify
    }}>
      {children}
    </AppContext.Provider>
  );
};