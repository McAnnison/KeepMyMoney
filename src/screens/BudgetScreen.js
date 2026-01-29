import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList
} from 'react-native';
import { StorageService } from '../services/StorageService';
import { Budget, ExpenseCategories } from '../models/FinanceModels';
import { formatCurrency, getCategoryTotal, getCurrentMonth, filterByMonth } from '../utils/helpers';

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('Food');
  const [threshold, setThreshold] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const budgetData = await StorageService.loadBudgets();
    const expenseData = await StorageService.loadExpenses();
    setBudgets(budgetData);
    setExpenses(expenseData);
  };

  const addBudget = async () => {
    if (!threshold) {
      Alert.alert('Error', 'Please enter a threshold amount');
      return;
    }

    const numThreshold = parseFloat(threshold);
    if (isNaN(numThreshold) || numThreshold <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount');
      return;
    }

    // Check if budget for this category already exists
    const existingIndex = budgets.findIndex(b => b.category === category);
    
    const newBudget = new Budget(category, numThreshold, 'monthly');
    let updatedBudgets;
    
    if (existingIndex >= 0) {
      updatedBudgets = [...budgets];
      updatedBudgets[existingIndex] = newBudget;
      Alert.alert('Success', `Budget for ${category} updated!`);
    } else {
      updatedBudgets = [...budgets, newBudget];
      Alert.alert('Success', `Budget for ${category} added!`);
    }

    await StorageService.saveBudgets(updatedBudgets);
    setBudgets(updatedBudgets);
    
    // Reset form
    setThreshold('');
    setShowForm(false);
  };

  const deleteBudget = async (category) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedBudgets = budgets.filter(b => b.category !== category);
            await StorageService.saveBudgets(updatedBudgets);
            setBudgets(updatedBudgets);
          }
        }
      ]
    );
  };

  const currentMonth = getCurrentMonth();
  const monthlyExpenses = filterByMonth(expenses, currentMonth);

  const renderBudget = ({ item }) => {
    const spent = getCategoryTotal(monthlyExpenses, item.category);
    const percentage = (spent / item.threshold) * 100;
    const remaining = item.threshold - spent;
    const isOverBudget = spent > item.threshold;
    const isWarning = percentage > 80;

    return (
      <View style={[
        styles.budgetItem,
        isOverBudget && styles.budgetItemDanger,
        isWarning && !isOverBudget && styles.budgetItemWarning
      ]}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetCategory}>{item.category}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteBudget(item.category)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.budgetDetails}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Budget:</Text>
            <Text style={styles.budgetValue}>{formatCurrency(item.threshold)}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Spent:</Text>
            <Text style={[
              styles.budgetValue,
              isOverBudget && styles.overBudget
            ]}>
              {formatCurrency(spent)}
            </Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Remaining:</Text>
            <Text style={[
              styles.budgetValue,
              isOverBudget && styles.overBudget
            ]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min(percentage, 100)}%` },
              isOverBudget && styles.progressBarDanger,
              isWarning && !isOverBudget && styles.progressBarWarning
            ]}
          />
        </View>
        <Text style={styles.percentageText}>
          {percentage.toFixed(1)}% used
          {isOverBudget && ' - Over budget!'}
          {isWarning && !isOverBudget && ' - Approaching limit'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget & Thresholds</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Set Budget Threshold</Text>
          
          <Text style={styles.label}>Category:</Text>
          <ScrollView horizontal style={styles.categoryScroll}>
            {ExpenseCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.categoryButtonTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TextInput
            style={styles.input}
            placeholder="Monthly Budget Amount"
            keyboardType="decimal-pad"
            value={threshold}
            onChangeText={setThreshold}
          />
          
          <TouchableOpacity style={styles.submitButton} onPress={addBudget}>
            <Text style={styles.submitButtonText}>Set Budget</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Active Budgets (This Month)</Text>
        {budgets.length === 0 ? (
          <Text style={styles.emptyText}>
            No budgets set yet. Add budget thresholds to track your spending!
          </Text>
        ) : (
          <FlatList
            data={budgets}
            renderItem={renderBudget}
            keyExtractor={(item) => item.category}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 14,
  },
  budgetItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  budgetItemWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
  },
  budgetItemDanger: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 12,
  },
  budgetDetails: {
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  overBudget: {
    color: '#f44336',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressBarWarning: {
    backgroundColor: '#FFA726',
  },
  progressBarDanger: {
    backgroundColor: '#f44336',
  },
  percentageText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
