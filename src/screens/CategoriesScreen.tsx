// src/screens/CategoriesScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import CategoryItem from '../components/CategoryItem';
import { COLORS, SIZES } from '../constants/theme';

export default function CategoriesScreen() {
  const { categories, transactions } = useContext(AppContext);
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const categorySums = categories[type].map((cat) => {
    const filtered = transactions.filter(t => t.type === type && t.category === cat);
    const sum = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    return { category: cat, amount: sum };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.switchRow}>
        <TouchableOpacity onPress={() => setType('expense')} style={[styles.switchButton, type === 'expense' && styles.selected]}>
          <Text style={[styles.switchText, type === 'expense' && styles.switchTextSelected]}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setType('income')} style={[styles.switchButton, type === 'income' && styles.selected]}>
          <Text style={[styles.switchText, type === 'income' && styles.switchTextSelected]}>Income</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categorySums}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <CategoryItem category={item.category} amount={item.amount} type={type} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
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
  title: {
    fontSize: SIZES.title,
    fontWeight: '600',
    marginBottom: SIZES.padding,
    color: COLORS.textPrimary
  },
  switchRow: {
    flexDirection: 'row',
    marginBottom: SIZES.padding
  },
  switchButton: {
    flex:1,
    alignItems:'center',
    paddingVertical: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base
  },
  selected: {
    borderColor: COLORS.accent,
    backgroundColor: '#E8F0FF'
  },
  switchText: {
    fontSize: SIZES.h3,
    color: COLORS.textSecondary
  },
  switchTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: '600'
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SIZES.padding
  }
});