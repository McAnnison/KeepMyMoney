// Utility functions for calculations and formatting

export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const filterByMonth = (items, month) => {
  return items.filter(item => {
    const itemDate = new Date(item.date);
    const itemMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
    return itemMonth === month;
  });
};

export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
};

export const calculateBalance = (incomes, expenses) => {
  const totalIncome = calculateTotal(incomes);
  const totalExpenses = calculateTotal(expenses);
  return totalIncome - totalExpenses;
};

export const getCategoryTotal = (items, category) => {
  return items
    .filter(item => item.category === category)
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
};
