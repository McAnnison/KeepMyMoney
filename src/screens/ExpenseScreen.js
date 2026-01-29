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
import { Expense, ExpenseCategories } from '../models/FinanceModels';
import { AIService } from '../services/AIService';
import { formatCurrency, formatDate, generateId } from '../utils/helpers';

export default function ExpenseScreen() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const expenseData = await StorageService.loadExpenses();
    const budgetData = await StorageService.loadBudgets();
    setExpenses(expenseData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setBudgets(budgetData);
  };

  const addExpense = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Get AI recommendation
    const recommendation = AIService.getSpendingRecommendations(
      category,
      parseFloat(amount),
      budgets
    );

    if (recommendation.warning) {
      Alert.alert(
        'Spending Alert',
        recommendation.message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Anyway',
            onPress: () => saveExpense()
          }
        ]
      );
    } else {
      await saveExpense();
    }
  };

  const saveExpense = async () => {
    const newExpense = new Expense(
      generateId(),
      parseFloat(amount),
      description,
      new Date().toISOString(),
      category
    );

    const updatedExpenses = [...expenses, newExpense];
    await StorageService.saveExpenses(updatedExpenses);
    setExpenses(updatedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('Food');
    setShowForm(false);
    
    Alert.alert('Success', 'Expense added successfully!');
  };

  const deleteExpense = async (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedExpenses = expenses.filter(e => e.id !== id);
            await StorageService.saveExpenses(updatedExpenses);
            setExpenses(updatedExpenses);
          }
        }
      ]
    );
  };

  const renderExpense = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteExpense(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Tracking</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Expense</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Description (e.g., Lunch at cafeteria)"
            value={description}
            onChangeText={setDescription}
          />
          
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
          
          <TouchableOpacity style={styles.submitButton} onPress={addExpense}>
            <Text style={styles.submitButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Expense History</Text>
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expense records yet. Add your first one!</Text>
        ) : (
          <FlatList
            data={expenses}
            renderItem={renderExpense}
            keyExtractor={(item) => item.id}
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
    backgroundColor: '#f44336',
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
    color: '#f44336',
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
    backgroundColor: '#f44336',
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
    backgroundColor: '#f44336',
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
  expenseItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#f44336',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 4,
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
});
