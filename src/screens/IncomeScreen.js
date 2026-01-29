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
import { Income, IncomeCategories } from '../models/FinanceModels';
import { formatCurrency, formatDate, generateId } from '../utils/helpers';

export default function IncomeScreen() {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Allowance');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    const data = await StorageService.loadIncomes();
    setIncomes(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const addIncome = async () => {
    if (!amount || !source) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount');
      return;
    }

    const newIncome = new Income(
      generateId(),
      numAmount,
      source,
      new Date().toISOString(),
      category
    );

    const updatedIncomes = [...incomes, newIncome];
    await StorageService.saveIncomes(updatedIncomes);
    setIncomes(updatedIncomes.sort((a, b) => new Date(b.date) - new Date(a.date)));
    
    // Reset form
    setAmount('');
    setSource('');
    setCategory('Allowance');
    setShowForm(false);
    
    Alert.alert('Success', 'Income added successfully!');
  };

  const deleteIncome = async (id) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedIncomes = incomes.filter(i => i.id !== id);
            await StorageService.saveIncomes(updatedIncomes);
            setIncomes(updatedIncomes);
          }
        }
      ]
    );
  };

  const renderIncome = ({ item }) => (
    <View style={styles.incomeItem}>
      <View style={styles.incomeInfo}>
        <Text style={styles.incomeSource}>{item.source}</Text>
        <Text style={styles.incomeCategory}>{item.category}</Text>
        <Text style={styles.incomeDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.incomeRight}>
        <Text style={styles.incomeAmount}>{formatCurrency(item.amount)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteIncome(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Income Tracking</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Income</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Source (e.g., Part-time job)"
            value={source}
            onChangeText={setSource}
          />
          
          <Text style={styles.label}>Category:</Text>
          <ScrollView horizontal style={styles.categoryScroll}>
            {IncomeCategories.map((cat) => (
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
          
          <TouchableOpacity style={styles.submitButton} onPress={addIncome}>
            <Text style={styles.submitButtonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Income History</Text>
        {incomes.length === 0 ? (
          <Text style={styles.emptyText}>No income records yet. Add your first one!</Text>
        ) : (
          <FlatList
            data={incomes}
            renderItem={renderIncome}
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
    backgroundColor: '#4CAF50',
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
    color: '#4CAF50',
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
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#4CAF50',
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
  incomeItem: {
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
  incomeInfo: {
    flex: 1,
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  incomeCategory: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 2,
  },
  incomeDate: {
    fontSize: 12,
    color: '#999',
  },
  incomeRight: {
    alignItems: 'flex-end',
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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
