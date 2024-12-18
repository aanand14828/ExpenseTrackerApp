// src/components/TransactionItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface TransactionItemProps {
  item: {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    note?: string;
    date: string;
  };
  onPress: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.category}>{item.category}</Text>
        {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
      </View>
      <Text style={[styles.amount, item.type === 'expense' ? styles.expense : styles.income]}>
        {item.type === 'expense' ? '-' : '+'}${Number(item.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.base * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  left: {
    flex: 1
  },
  category: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2
  },
  note: {
    fontSize: SIZES.h5,
    color: COLORS.textSecondary
  },
  amount: {
    fontSize: SIZES.h3,
    fontWeight: '600'
  },
  expense: {
    color: COLORS.danger
  },
  income: {
    color: COLORS.success
  }
});