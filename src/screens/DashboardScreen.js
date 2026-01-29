import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { StorageService } from '../services/StorageService';
import { AIService } from '../services/AIService';
import {
  formatCurrency,
  calculateBalance,
  getCurrentMonth,
  filterByMonth
} from '../utils/helpers';

export default function DashboardScreen({ navigation }) {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedIncomes = await StorageService.loadIncomes();
    const loadedExpenses = await StorageService.loadExpenses();
    const loadedBudgets = await StorageService.loadBudgets();
    setIncomes(loadedIncomes);
    setExpenses(loadedExpenses);
    setBudgets(loadedBudgets);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const currentMonth = getCurrentMonth();
  const monthlyIncomes = filterByMonth(incomes, currentMonth);
  const monthlyExpenses = filterByMonth(expenses, currentMonth);
  const balance = calculateBalance(monthlyIncomes, monthlyExpenses);
  const totalIncome = monthlyIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Get AI tips
  const tips = AIService.getSavingTips(monthlyExpenses, monthlyIncomes, budgets);
  const topTip = tips.find(t => t.priority === 'high') || tips[0];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KeepMyMoney</Text>
        <Text style={styles.headerSubtitle}>Student Finance Tracker</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={[styles.balanceAmount, balance < 0 && styles.negativeBalance]}>
          {formatCurrency(balance)}
        </Text>
        <View style={styles.balanceDetails}>
          <View>
            <Text style={styles.detailLabel}>Income</Text>
            <Text style={styles.incomeAmount}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View>
            <Text style={styles.detailLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>{formatCurrency(totalExpense)}</Text>
          </View>
        </View>
      </View>

      {topTip && (
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 AI Tip</Text>
          <Text style={styles.tipContent}>{topTip.title}</Text>
          <Text style={styles.tipDescription}>{topTip.description}</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.incomeButton]}
          onPress={() => navigation.navigate('Income')}
        >
          <Text style={styles.actionButtonText}>+ Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.expenseButton]}
          onPress={() => navigation.navigate('Expenses')}
        >
          <Text style={styles.actionButtonText}>- Add Expense</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{monthlyIncomes.length}</Text>
            <Text style={styles.statLabel}>Incomes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{monthlyExpenses.length}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{budgets.length}</Text>
            <Text style={styles.statLabel}>Budgets</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  negativeBalance: {
    color: '#f44336',
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f44336',
  },
  tipCard: {
    backgroundColor: '#FFF9C4',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FDD835',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  incomeButton: {
    backgroundColor: '#4CAF50',
  },
  expenseButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
