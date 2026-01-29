import { Income, Expense, Budget, IncomeCategories, ExpenseCategories } from '../src/models/FinanceModels';
import { formatCurrency, formatDate, calculateBalance, generateId } from '../src/utils/helpers';

describe('Finance Models', () => {
  test('Income model creates correctly', () => {
    const income = new Income('1', 100, 'Test', '2024-01-01', 'Allowance');
    expect(income.amount).toBe(100);
    expect(income.source).toBe('Test');
    expect(income.type).toBe('income');
  });

  test('Expense model creates correctly', () => {
    const expense = new Expense('1', 50, 'Test expense', '2024-01-01', 'Food');
    expect(expense.amount).toBe(50);
    expect(expense.description).toBe('Test expense');
    expect(expense.type).toBe('expense');
  });

  test('Budget model creates correctly', () => {
    const budget = new Budget('Food', 500, 'monthly');
    expect(budget.category).toBe('Food');
    expect(budget.threshold).toBe(500);
    expect(budget.period).toBe('monthly');
  });

  test('Income categories are defined', () => {
    expect(IncomeCategories).toContain('Allowance');
    expect(IncomeCategories).toContain('Scholarship');
  });

  test('Expense categories are defined', () => {
    expect(ExpenseCategories).toContain('Food');
    expect(ExpenseCategories).toContain('Transport');
  });
});

describe('Helper Functions', () => {
  test('formatCurrency formats numbers correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(99.5)).toBe('$99.50');
  });

  test('calculateBalance works correctly', () => {
    const incomes = [
      new Income('1', 100, 'Test', '2024-01-01'),
      new Income('2', 50, 'Test', '2024-01-01')
    ];
    const expenses = [
      new Expense('1', 30, 'Test', '2024-01-01'),
      new Expense('2', 20, 'Test', '2024-01-01')
    ];
    expect(calculateBalance(incomes, expenses)).toBe(100);
  });

  test('generateId creates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });
});
