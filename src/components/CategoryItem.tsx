// src/components/CategoryItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface CategoryItemProps {
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, amount, type }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{category}</Text>
      <Text style={[styles.amount, type === 'expense' ? styles.expense : styles.income]}>
        ${amount.toFixed(2)}
      </Text>
    </View>
  );
}

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1
  },
  name: {
    fontSize: SIZES.h3,
    fontWeight: '500',
    color: COLORS.textPrimary
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