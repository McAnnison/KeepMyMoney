# KeepMyMoney 💰

A mobile app to help students manage their finances whether on campus or at home.

## Features

- 📊 **Income Tracking** - Record and categorize all sources of income (allowance, part-time jobs, scholarships, etc.)
- 💸 **Expense Tracking** - Track daily expenses across multiple categories (food, transport, books, entertainment, etc.)
- 🎯 **Budget Thresholds** - Set spending limits for each category and get alerts when approaching or exceeding them
- 💡 **AI Financial Tips** - Get personalized saving recommendations and smart spending advice based on your financial patterns
- 📱 **Cross-Platform** - Works on iOS, Android, and web

## AI-Powered Features

The app includes an intelligent AI service that:
- Analyzes your spending patterns
- Provides personalized saving tips
- Alerts you when you're overspending in specific categories
- Offers budget-conscious recommendations before making large purchases
- Shares student-specific financial advice

## Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **JavaScript** for core logic

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, for easier development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/McAnnison/KeepMyMoney.git
cd KeepMyMoney
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS (macOS only)
   - Press `w` for web
   - Or scan the QR code with Expo Go app on your phone

## Usage

### Dashboard
The main screen shows your current balance, income vs expenses, and top AI tips.

### Income Tab
Add income from various sources:
- Allowance
- Part-time Jobs
- Scholarships
- Gifts
- Other sources

### Expenses Tab
Track all your spending with categories:
- Food
- Transport
- Books & Supplies
- Entertainment
- Housing & Utilities
- Health
- Clothing
- Other

### Budget Tab
Set monthly spending thresholds for each category. The app will:
- Show visual progress bars
- Alert when approaching limits (>80%)
- Warn when over budget

### AI Tips Tab
Get personalized financial advice including:
- Savings rate analysis
- Category spending insights
- Budget adherence alerts
- General student money-saving tips

## Project Structure

```
KeepMyMoney/
├── App.js                          # Main app component with navigation
├── src/
│   ├── models/
│   │   └── FinanceModels.js       # Data models (Income, Expense, Budget)
│   ├── screens/
│   │   ├── DashboardScreen.js     # Main dashboard
│   │   ├── IncomeScreen.js        # Income tracking
│   │   ├── ExpenseScreen.js       # Expense tracking
│   │   ├── BudgetScreen.js        # Budget management
│   │   └── TipsScreen.js          # AI tips and advice
│   ├── services/
│   │   ├── StorageService.js      # Data persistence
│   │   └── AIService.js           # AI-powered recommendations
│   └── utils/
│       └── helpers.js             # Utility functions
├── package.json
├── app.json
└── babel.config.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

McAnnison

## Acknowledgments

- Built with React Native and Expo
- Designed for students to improve financial literacy and money management skills
