// src/screens/TransactionDetailScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { COLORS, SIZES } from '../constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TransactionDetailScreen() {
  const { params } = useRoute();
  const { transactionId } = params as { transactionId: string };
  const { transactions, deleteTransaction } = useContext(AppContext);
  const navigation = useNavigation();

  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Transaction not found</Text>
      </View>
    );
  }

  const onDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this transaction?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTransaction(transactionId);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.type}>{transaction.type.toUpperCase()}</Text>
      <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
      <Text style={styles.category}>{transaction.category}</Text>
      {transaction.note ? <Text style={styles.note}>{transaction.note}</Text> : null}
      <Text style={styles.date}>{new Date(transaction.date).toLocaleString()}</Text>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>Delete Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  type: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.base
  },
  amount: {
    fontSize: SIZES.largeTitle,
    fontWeight: '700',
    marginBottom: SIZES.base,
    color: COLORS.accent
  },
  category: {
    fontSize: SIZES.h3,
    fontWeight: '500',
    marginBottom: SIZES.base,
    color: COLORS.textPrimary
  },
  note: {
    fontSize: SIZES.h4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base
  },
  date: {
    fontSize: SIZES.h5,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center'
  },
  deleteText: {
    color: '#fff',
    fontSize: SIZES.h3,
    fontWeight: '600'
  },
  errorText: {
    textAlign: 'center',
    fontSize: SIZES.h3,
    marginTop: SIZES.padding,
    color: COLORS.textSecondary
  }
});