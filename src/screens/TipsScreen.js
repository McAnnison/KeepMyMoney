import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native';
import { StorageService } from '../services/StorageService';
import { AIService } from '../services/AIService';
import { getCurrentMonth, filterByMonth } from '../utils/helpers';

export default function TipsScreen() {
  const [tips, setTips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    const incomes = await StorageService.loadIncomes();
    const expenses = await StorageService.loadExpenses();
    const budgets = await StorageService.loadBudgets();
    
    const currentMonth = getCurrentMonth();
    const monthlyIncomes = filterByMonth(incomes, currentMonth);
    const monthlyExpenses = filterByMonth(expenses, currentMonth);
    
    const generatedTips = AIService.getSavingTips(monthlyExpenses, monthlyIncomes, budgets);
    setTips(generatedTips);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTips();
    setRefreshing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#FFA726';
      default:
        return '#4CAF50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      default:
        return '💡';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Financial Tips</Text>
        <Text style={styles.headerSubtitle}>Personalized advice to save smarter</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Personalized Tips</Text>
        
        {tips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>
              Start tracking your income and expenses to get personalized AI tips!
            </Text>
          </View>
        ) : (
          tips.map((tip, index) => (
            <View
              key={index}
              style={[
                styles.tipCard,
                { borderLeftColor: getPriorityColor(tip.priority) }
              ]}
            >
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>{getPriorityIcon(tip.priority)}</Text>
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
              <View style={styles.tipFooter}>
                <Text style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(tip.priority) }
                ]}>
                  {tip.priority.toUpperCase()}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.generalTipsSection}>
          <Text style={styles.sectionTitle}>General Student Tips</Text>
          
          <View style={styles.generalTip}>
            <Text style={styles.generalTipIcon}>🎓</Text>
            <View style={styles.generalTipContent}>
              <Text style={styles.generalTipTitle}>Student Discounts</Text>
              <Text style={styles.generalTipText}>
                Always carry your student ID. Many restaurants, stores, and services offer 10-20% discounts.
              </Text>
            </View>
          </View>

          <View style={styles.generalTip}>
            <Text style={styles.generalTipIcon}>📚</Text>
            <View style={styles.generalTipContent}>
              <Text style={styles.generalTipTitle}>Textbook Savings</Text>
              <Text style={styles.generalTipText}>
                Buy used textbooks, rent them, or use library copies. Consider digital versions for additional savings.
              </Text>
            </View>
          </View>

          <View style={styles.generalTip}>
            <Text style={styles.generalTipIcon}>🍳</Text>
            <View style={styles.generalTipContent}>
              <Text style={styles.generalTipTitle}>Meal Planning</Text>
              <Text style={styles.generalTipText}>
                Cook in batches and meal prep. It's cheaper and healthier than eating out every day.
              </Text>
            </View>
          </View>

          <View style={styles.generalTip}>
            <Text style={styles.generalTipIcon}>🚌</Text>
            <View style={styles.generalTipContent}>
              <Text style={styles.generalTipTitle}>Transportation</Text>
              <Text style={styles.generalTipText}>
                Use campus shuttle services and student transit passes. Walk or bike when possible to save money.
              </Text>
            </View>
          </View>

          <View style={styles.generalTip}>
            <Text style={styles.generalTipIcon}>💳</Text>
            <View style={styles.generalTipContent}>
              <Text style={styles.generalTipTitle}>Emergency Fund</Text>
              <Text style={styles.generalTipText}>
                Try to save at least $500-1000 for emergencies. Start small with $10-20 per week.
              </Text>
            </View>
          </View>

          <View style={styles.generalTip}>
            <Text style={styles.generalTipIcon}>🎯</Text>
            <View style={styles.generalTipContent}>
              <Text style={styles.generalTipTitle}>Set Financial Goals</Text>
              <Text style={styles.generalTipText}>
                Define short-term (semester break trip) and long-term (post-graduation fund) savings goals.
              </Text>
            </View>
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
    backgroundColor: '#9C27B0',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    overflow: 'hidden',
  },
  generalTipsSection: {
    marginTop: 24,
  },
  generalTip: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  generalTipIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  generalTipContent: {
    flex: 1,
  },
  generalTipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  generalTipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
