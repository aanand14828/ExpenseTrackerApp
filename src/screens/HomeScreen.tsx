import React, { useContext, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import { COLORS, SIZES } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const { transactions, balance, totalIncome, totalExpense } = useContext(AppContext);
  const navigation = useNavigation();

  // Memoize chart data computation so it doesn't recompute every render
  const { labels, data } = useMemo(() => {
    // Filter for expenses only, since we’re charting spending
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    // Create a map of 'YYYY-MM' -> totalExpense
    const monthlyMap: Record<string, number> = {};

    for (const tx of expenseTransactions) {
      const date = new Date(tx.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 0-based
      const key = `${year}-${month.toString().padStart(2,'0')}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = 0;
      }
      monthlyMap[key] += tx.amount;
    }

    // Sort keys by date
    const sortedKeys = Object.keys(monthlyMap).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    // Prepare chart data
    const labels = sortedKeys.map(k => k); 
    // For a nicer label, extract month name or just show MM/YYYY:
    // Convert 'YYYY-MM' to something like 'Mar 2023'
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formattedLabels = sortedKeys.map(k => {
      const [y,m] = k.split('-');
      const monthIndex = parseInt(m,10)-1;
      return `${monthNames[monthIndex]} '${y.slice(-2)}`;
    });

    const data = sortedKeys.map(k => monthlyMap[k]);

    return { labels: formattedLabels, data };
  }, [transactions]);

  const chartConfig = {
    backgroundGradientFrom: COLORS.background,
    backgroundGradientTo: COLORS.background,
    color: (opacity = 1) => `rgba(76,130,247, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30,30,30, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: COLORS.background
    }
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <BalanceCard balance={balance} income={totalIncome} expense={totalExpense}/>

      {/* Chart Section */}
      <Text style={styles.chartTitle}>Monthly Spending</Text>
      {data.length > 0 ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data }]
          }}
          width={screenWidth - 2 * SIZES.padding} // total width - padding
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      ) : (
        <Text style={styles.noData}>No expense data available for chart.</Text>
      )}

      {/* Transactions List */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddTransaction' as never)}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onPress={() => navigation.navigate('TransactionDetail' as never, { transactionId: item.id } as never)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.background
  },
  chartTitle: {
    fontSize: SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginVertical: SIZES.base
  },
  noData: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SIZES.padding
  },
  chart: {
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SIZES.base
  },
  header: {
    fontSize: SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SIZES.padding
  }
});