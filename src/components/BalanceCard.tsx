// src/components/BalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, income, expense }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Balance</Text>
      <Text style={styles.balance}>${balance.toFixed(2)}</Text>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.income}>+${income.toFixed(2)}</Text>
        </View>
        <View style={styles.separator}/>
        <View style={styles.box}>
          <Text style={styles.label}>Expense</Text>
          <Text style={styles.expense}>-${expense.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.base,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: SIZES.h3,
    fontWeight: '500',
    marginBottom: SIZES.base,
  },
  balance: {
    color: COLORS.textPrimary,
    fontSize: SIZES.largeTitle,
    fontWeight: '700',
    marginBottom: SIZES.padding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.base,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: SIZES.h4,
    marginBottom: 4,
  },
  income: {
    color: COLORS.success,
    fontSize: SIZES.h2,
    fontWeight: '600',
  },
  expense: {
    color: COLORS.danger,
    fontSize: SIZES.h2,
    fontWeight: '600',
  },
});