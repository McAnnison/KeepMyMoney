// Core data models for the app

export class Income {
  constructor(id, amount, source, date, category = 'Other') {
    this.id = id;
    this.amount = parseFloat(amount);
    this.source = source;
    this.date = date;
    this.category = category;
    this.type = 'income';
  }
}

export class Expense {
  constructor(id, amount, description, date, category = 'Other') {
    this.id = id;
    this.amount = parseFloat(amount);
    this.description = description;
    this.date = date;
    this.category = category;
    this.type = 'expense';
  }
}

export class Budget {
  constructor(category, threshold, period = 'monthly') {
    this.category = category;
    this.threshold = parseFloat(threshold);
    this.period = period;
  }
}

export const IncomeCategories = [
  'Allowance',
  'Part-time Job',
  'Scholarship',
  'Gift',
  'Other'
];

export const ExpenseCategories = [
  'Food',
  'Transport',
  'Books & Supplies',
  'Entertainment',
  'Housing',
  'Utilities',
  'Health',
  'Clothing',
  'Other'
];
