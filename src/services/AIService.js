// AI Service to provide financial tips and recommendations
// This is a simple implementation. In a real app, this could integrate with OpenAI or similar services.

export const AIService = {
  // Get personalized saving tips based on user's spending patterns
  getSavingTips(expenses, incomes, budgets) {
    const tips = [];
    
    // Calculate total income and expenses
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    // Tip 1: Savings rate
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
    if (savingsRate < 20) {
      tips.push({
        title: "Increase Your Savings Rate",
        description: `You're currently saving ${savingsRate.toFixed(1)}% of your income. Try to aim for at least 20% by reducing discretionary spending.`,
        priority: "high"
      });
    } else {
      tips.push({
        title: "Great Savings Rate!",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the good work!`,
        priority: "low"
      });
    }
    
    // Tip 2: Category analysis
    const categorySpending = {};
    expenses.forEach(expense => {
      categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
    });
    
    // Check for overspending in categories
    for (const [category, amount] of Object.entries(categorySpending)) {
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      if (category === 'Food' && percentage > 30) {
        tips.push({
          title: "Food Spending Alert",
          description: `Food expenses are ${percentage.toFixed(1)}% of your total spending. Consider meal planning and cooking at home more often.`,
          priority: "medium"
        });
      }
      
      if (category === 'Entertainment' && percentage > 20) {
        tips.push({
          title: "Entertainment Budget Check",
          description: `Entertainment is ${percentage.toFixed(1)}% of your spending. Look for free campus events or student discounts.`,
          priority: "medium"
        });
      }
    }
    
    // Tip 3: Budget adherence
    budgets.forEach(budget => {
      const spent = categorySpending[budget.category] || 0;
      const percentage = (spent / budget.threshold) * 100;
      
      if (percentage > 90) {
        tips.push({
          title: `${budget.category} Budget Alert`,
          description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget. Be mindful of additional expenses.`,
          priority: "high"
        });
      }
    });
    
    // Tip 4: General student tips
    if (tips.length < 3) {
      tips.push({
        title: "Student Discount Reminder",
        description: "Always ask about student discounts! Many businesses offer 10-20% off with a valid student ID.",
        priority: "low"
      });
      
      tips.push({
        title: "Track Small Expenses",
        description: "Small daily expenses like coffee can add up. Track them to see where you can save.",
        priority: "low"
      });
    }
    
    return tips;
  },
  
  // Get smart spending recommendations
  getSpendingRecommendations(category, amount, budgets) {
    const budget = budgets.find(b => b.category === category);
    
    if (!budget) {
      return {
        canSpend: true,
        message: "No budget set for this category. Consider setting one to track spending better."
      };
    }
    
    // This would need to check current spending for the period
    // Simplified version here
    if (amount > budget.threshold * 0.5) {
      return {
        canSpend: true,
        message: `This is a large expense (${((amount / budget.threshold) * 100).toFixed(1)}% of your ${category} budget). Make sure it's necessary.`,
        warning: true
      };
    }
    
    return {
      canSpend: true,
      message: "This expense looks reasonable for your budget."
    };
  }
};
